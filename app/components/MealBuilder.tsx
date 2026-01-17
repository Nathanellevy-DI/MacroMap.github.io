"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FoodItem, MacroTotals } from "../types";
import { searchFood, NutritionData, findCommonFood, getProductByBarcode } from "../lib/food-api";
import { searchRestaurants, MenuItem, Restaurant, RESTAURANTS } from "../lib/restaurants";
import { searchWholeFoods, WholeFood, calculateNutrition, lbsToGrams, kgToGrams, ozToGrams, WHOLE_FOODS } from "../lib/whole-foods";
import NearbyRestaurants from "./NearbyRestaurants";

interface MealBuilderProps {
    onBack: () => void;
    onLogMeal: (calories: number, items: FoodItem[]) => void;
    mealType?: string | null;
}

type Tab = "search" | "restaurant" | "nearby" | "custom" | "scan";

// Get unique categories from whole foods
const FOOD_CATEGORIES = [...new Set(WHOLE_FOODS.map(f => f.category))];

function MacroRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.5s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-gray-800">{Math.round(value)}</span>
                </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
    );
}

function MacroSummary({ totals }: { totals: MacroTotals }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{Math.round(totals.calories)}</h3>
                    <p className="text-xs text-gray-500">Calories</p>
                </div>
                <div className="flex gap-3">
                    <MacroRing value={totals.protein} max={150} color="#22c55e" label="Protein" />
                    <MacroRing value={totals.carbs} max={250} color="#3b82f6" label="Carbs" />
                    <MacroRing value={totals.fat} max={65} color="#f59e0b" label="Fat" />
                </div>
            </div>
            <div className="space-y-2">
                {[
                    { name: "P", value: totals.protein, max: 150, color: "#22c55e" },
                    { name: "C", value: totals.carbs, max: 250, color: "#3b82f6" },
                    { name: "F", value: totals.fat, max: 65, color: "#f59e0b" },
                ].map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                        <span className="text-xs w-4 text-gray-500">{m.name}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%`, background: m.color }} />
                        </div>
                        <span className="text-xs w-12 text-right text-gray-400">{m.value.toFixed(0)}g</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FoodCard({ item, onRemove }: { item: FoodItem; onRemove: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.servingSize}</p>
            </div>
            <div className="flex items-center gap-3 text-xs shrink-0 font-medium">
                <span className="text-emerald-500">{item.protein}g</span>
                <span className="text-blue-500">{item.carbs}g</span>
                <span className="text-amber-500">{item.fat}g</span>
                <span className="font-bold text-gray-700">{item.calories}</span>
            </div>
            <button onClick={onRemove} className="p-1.5 text-gray-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

function RestaurantMenuModal({ restaurant, onAdd, onClose }: { restaurant: Restaurant; onAdd: (item: MenuItem) => void; onClose: () => void }) {
    const categories = [...new Set(restaurant.items.map((i) => i.category))];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content slide-up bg-white text-gray-800" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle bg-gray-200" />
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{restaurant.logo}</span>
                        <h3 className="text-lg font-bold">{restaurant.name}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {categories.map((cat) => (
                        <div key={cat}>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">{cat}</h4>
                            <div className="space-y-2">
                                {restaurant.items.filter((i) => i.category === cat).map((item, idx) => (
                                    <button key={idx} onClick={() => onAdd(item)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-left hover:bg-slate-100 flex items-center justify-between transition-colors">
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                                <span>{item.calories} cal</span>
                                                <span className="text-emerald-500 font-medium">{item.protein}g P</span>
                                                <span className="text-blue-500 font-medium">{item.carbs}g C</span>
                                                <span className="text-amber-500 font-medium">{item.fat}g F</span>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CustomFoodModal({ food, onAdd, onClose }: { food: WholeFood; onAdd: (food: FoodItem) => void; onClose: () => void }) {
    const [weight, setWeight] = useState("");
    const [unit, setUnit] = useState<"g" | "oz" | "lbs" | "kg">("g");
    const [selectedServing, setSelectedServing] = useState<string | null>(null);

    const getGrams = (): number => {
        if (selectedServing) {
            const serving = food.commonServings.find((s) => s.name === selectedServing);
            return serving?.grams || 100;
        }
        const w = parseFloat(weight) || 0;
        switch (unit) {
            case "oz": return ozToGrams(w);
            case "lbs": return lbsToGrams(w);
            case "kg": return kgToGrams(w);
            default: return w;
        }
    };

    const grams = getGrams();
    const nutrition = calculateNutrition(food, grams);

    const handleAdd = () => {
        if (grams <= 0) return;
        onAdd({
            id: Date.now().toString(),
            name: food.name,
            servingSize: selectedServing || `${grams}g`,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            fiber: nutrition.fiber,
            timestamp: Date.now(),
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content slide-up bg-white text-gray-800" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle bg-gray-200" />
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{food.emoji}</span>
                        <div>
                            <h3 className="font-bold">{food.name}</h3>
                            <p className="text-xs text-gray-500">{food.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Quick Servings</label>
                    <div className="flex flex-wrap gap-2">
                        {food.commonServings.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => { setSelectedServing(s.name); setWeight(""); }}
                                className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedServing === s.name ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Or enter weight</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => { setWeight(e.target.value); setSelectedServing(null); }}
                            placeholder="Amount"
                            className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as typeof unit)}
                            className="w-20 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl"
                        >
                            <option value="g">g</option>
                            <option value="oz">oz</option>
                            <option value="lbs">lbs</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
                    <div className="text-center mb-3">
                        <span className="text-3xl font-bold text-gray-800">{nutrition.calories}</span>
                        <span className="text-gray-500 ml-1">cal</span>
                    </div>
                    <div className="flex justify-around text-center">
                        <div><div className="text-lg font-semibold text-emerald-500">{nutrition.protein}g</div><div className="text-xs text-gray-500">Protein</div></div>
                        <div><div className="text-lg font-semibold text-blue-500">{nutrition.carbs}g</div><div className="text-xs text-gray-500">Carbs</div></div>
                        <div><div className="text-lg font-semibold text-amber-500">{nutrition.fat}g</div><div className="text-xs text-gray-500">Fat</div></div>
                    </div>
                </div>

                <button onClick={handleAdd} disabled={grams <= 0} className="btn btn-primary w-full">Add to Meal</button>
            </div>
        </div>
    );
}

export default function MealBuilder({ onBack, onLogMeal, mealType }: MealBuilderProps) {
    const [foods, setFoods] = useState<FoodItem[]>([]);

    // Auto-select tab and category based on mealType
    const isSnack = mealType === "snack";

    const [activeTab, setActiveTab] = useState<Tab>(isSnack ? "custom" : "search");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [selectedWholeFood, setSelectedWholeFood] = useState<WholeFood | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [barcode, setBarcode] = useState("");
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Effect to enforce Snack rules or default behavior
    useEffect(() => {
        if (isSnack) {
            setActiveTab("custom");
            // Optionally could pre-select Fruit/Veg here, but letting them browse Categories (filtered) is better UX
        }
    }, [isSnack]);

    // Filter categories for Snacks (Fruits, Vegetables, Nuts, Seeds, Yogurt/Dairy)
    const displayCategories = isSnack
        ? FOOD_CATEGORIES.filter(c => ["Fruits", "Vegetables", "Nuts", "Seeds", "Eggs & Dairy"].includes(c))
        : FOOD_CATEGORIES;

    const handleFinish = () => {
        if (foods.length === 0) return;

        onLogMeal(totals.calories, foods);
    };

    const totals: MacroTotals = foods.reduce(
        (acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
            fiber: acc.fiber + (food.fiber || 0),
            sugar: acc.sugar + (food.sugar || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    );

    const handleSearch = useCallback(async (query: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (query.length < 2) { setSearchResults([]); return; }

        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const commonFood = findCommonFood(query);
                const apiResults = await searchFood(query);
                setSearchResults(commonFood ? [commonFood, ...apiResults] : apiResults);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    }, []);

    const handleBarcodeSearch = async () => {
        if (!barcode) return;
        setIsSearching(true);
        try {
            const product = await getProductByBarcode(barcode);
            if (product) {
                handleAddFood({ name: product.name, brand: product.brand, servingSize: product.servingSize, calories: product.calories, protein: product.protein, carbs: product.carbs, fat: product.fat });
                setBarcode("");
            }
        } catch (error) {
            console.error("Barcode error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFood = (food: Partial<FoodItem> & { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
        const newFood: FoodItem = { id: Date.now().toString(), name: food.name, brand: food.brand, servingSize: food.servingSize || "1 serving", calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, fiber: food.fiber, sugar: food.sugar, sodium: food.sodium, timestamp: Date.now() };
        setFoods((prev) => [...prev, newFood]);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleAddMenuItem = (item: MenuItem) => {
        handleAddFood({ name: item.name, servingSize: "1 serving", calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat });
        setSelectedRestaurant(null);
    };

    // Get foods filtered by category
    const filteredWholeFoods = selectedCategory ? WHOLE_FOODS.filter(f => f.category === selectedCategory) : [];

    return (
        <div className="container safe-top safe-bottom py-6 max-w-lg mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center relative py-2">
                <button onClick={onBack} className="absolute left-0 p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                    {mealType ? `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Builder` : "Meal Builder"}
                </h1>
            </div>

            <MacroSummary totals={totals} />

            {/* Tabs */}
            <div className="tabs-container bg-white border border-gray-100 shadow-sm">
                {[
                    { id: "search", label: "🔍 Search", show: !isSnack },
                    { id: "nearby", label: "📍 Nearby", show: !isSnack },
                    { id: "restaurant", label: "🍔 Chains", show: !isSnack },
                    { id: "custom", label: isSnack ? "🍎 Healthy Snacks" : "🥩 Foods", show: true },
                    { id: "scan", label: "📷 Scan", show: !isSnack },
                ].filter(t => t.show).map((tab) => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id as Tab); setSelectedCategory(null); }} className={`tab-button ${activeTab === tab.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-gray-500 hover:bg-gray-50"}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {/* SEARCH TAB */}
                {activeTab === "search" && (
                    <>
                        <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value); }} placeholder="Search any food..." className="w-full mb-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400" />
                        {isSearching && <div className="flex justify-center py-8"><div className="spinner !border-gray-200 !border-t-emerald-500" /></div>}
                        {searchResults.length > 0 && (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {searchResults.map((food, i) => (
                                    <button key={i} onClick={() => handleAddFood(food)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-left hover:bg-gray-50 flex items-center gap-3 shadow-sm transition-colors">
                                        {food.image && <img src={food.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-gray-800">{food.name}</p>
                                            <div className="flex gap-2 text-xs text-gray-500">
                                                <span>{food.calories} cal</span>
                                                <span className="text-emerald-500">{food.protein}g P</span>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        )}
                        {!searchQuery && !isSearching && (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-4xl mb-3">🍽️</p>
                                <p>Type to search foods from Open Food Facts</p>
                            </div>
                        )}
                    </>
                )}

                {/* NEARBY TAB */}
                {activeTab === "nearby" && (
                    <NearbyRestaurants
                        onSelectRestaurant={(restaurant) => setSelectedRestaurant(restaurant)}
                    />
                )}

                {/* RESTAURANT TAB */}
                {activeTab === "restaurant" && (
                    <>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter restaurants..." className="w-full mb-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400" />
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {RESTAURANTS.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((restaurant, i) => (
                                <button key={i} onClick={() => setSelectedRestaurant(restaurant)} className="w-full bg-white border border-gray-100 rounded-xl p-4 text-left flex items-center gap-3 shadow-sm hover:bg-gray-50" style={{ borderLeftColor: restaurant.color, borderLeftWidth: 3 }}>
                                    <span className="text-2xl">{restaurant.logo}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{restaurant.name}</p>
                                        <p className="text-xs text-gray-500">{restaurant.items.length} items</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* WHOLE FOODS TAB */}
                {activeTab === "custom" && (
                    <>
                        {!selectedCategory ? (
                            <>
                                <p className="text-sm text-gray-400 mb-3">Choose a category:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {displayCategories.map((cat) => (
                                        <button key={cat} onClick={() => setSelectedCategory(cat)} className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:bg-gray-50 shadow-sm">
                                            <p className="font-semibold text-gray-800">{cat}</p>
                                            <p className="text-xs text-gray-500">{WHOLE_FOODS.filter(f => f.category === cat).length} items</p>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-sm text-emerald-500 mb-3 hover:underline">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to categories
                                </button>
                                <h3 className="font-semibold mb-3 text-gray-800">{selectedCategory}</h3>
                                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                                    {filteredWholeFoods.map((food, i) => (
                                        <button key={i} onClick={() => setSelectedWholeFood(food)} className="w-full bg-white border border-gray-100 rounded-xl p-3 text-left hover:bg-gray-50 flex items-center gap-3 shadow-sm">
                                            <span className="text-2xl w-10 text-center">{food.emoji}</span>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-800">{food.name}</p>
                                                <p className="text-xs text-gray-500">per 100g: {food.per100g.calories} cal • {food.per100g.protein}g P</p>
                                            </div>
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* BARCODE TAB */}
                {activeTab === "scan" && (
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-1 text-gray-800">Enter Barcode</h3>
                            <p className="text-sm text-gray-500 mb-4">Type the barcode number from the package</p>
                            <div className="flex gap-2">
                                <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="e.g., 012345678905" className="flex-1 bg-gray-50 border-gray-200 text-gray-800" onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()} />
                                <button onClick={handleBarcodeSearch} disabled={!barcode || isSearching} className="btn btn-primary !w-auto !px-6">
                                    {isSearching ? "..." : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Added Foods */}
            {foods.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-400">Added ({foods.length})</h3>
                        <button onClick={() => setFoods([])} className="text-xs text-red-500 hover:text-red-400">Clear</button>
                    </div>
                    {foods.map((food) => (
                        <FoodCard key={food.id} item={food} onRemove={() => setFoods((p) => p.filter((f) => f.id !== food.id))} />
                    ))}
                </div>
            )}

            {/* Modals */}
            {selectedRestaurant && <RestaurantMenuModal restaurant={selectedRestaurant} onAdd={handleAddMenuItem} onClose={() => setSelectedRestaurant(null)} />}
            {selectedWholeFood && <CustomFoodModal food={selectedWholeFood} onAdd={(food) => { setFoods((prev) => [...prev, food]); setSelectedWholeFood(null); }} onClose={() => setSelectedWholeFood(null)} />}

            <p className="text-xs text-center text-gray-500 pt-4 pb-24">Data: Open Food Facts • {RESTAURANTS.length} Restaurants • {WHOLE_FOODS.length}+ Whole Foods</p>

            {/* Sticky Bottom Log Button */}
            {foods.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-lg mx-auto">
                        <button
                            onClick={handleFinish}
                            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Log Meal</span>
                            <span className="bg-emerald-600 px-2 py-0.5 rounded-lg text-sm">{Math.round(totals.calories)} cal</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
