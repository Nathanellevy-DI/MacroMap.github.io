"use client";

import { useState, useRef, useCallback } from "react";
import { FoodItem, MacroTotals } from "../types";
import { analyzeMacros, getApiKey } from "../lib/api";

interface MealBuilderProps {
    onBack: () => void;
    onOpenSettings: () => void;
}

function MacroChart({ totals }: { totals: MacroTotals }) {
    const maxMacro = Math.max(totals.protein, totals.carbs, totals.fat, 1);

    const macros = [
        { name: "Protein", value: totals.protein, color: "#22c55e", goal: 150 },
        { name: "Carbs", value: totals.carbs, color: "#3b82f6", goal: 250 },
        { name: "Fat", value: totals.fat, color: "#f59e0b", goal: 65 },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Macro Breakdown</h3>
                <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{totals.calories}</div>
                    <div className="text-xs text-gray-500">calories</div>
                </div>
            </div>

            <div className="space-y-4">
                {macros.map((macro) => {
                    const percentage = Math.min((macro.value / macro.goal) * 100, 100);
                    return (
                        <div key={macro.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">{macro.name}</span>
                                <span className="font-medium" style={{ color: macro.color }}>
                                    {macro.value.toFixed(1)}g
                                </span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${percentage}%`,
                                        background: `linear-gradient(90deg, ${macro.color}, ${macro.color}aa)`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pie Chart Visualization */}
            <div className="mt-6 flex items-center justify-center">
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        {(() => {
                            const total = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
                            if (total === 0) {
                                return (
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3.8" />
                                );
                            }

                            const proteinCal = (totals.protein * 4 / total) * 100;
                            const carbsCal = (totals.carbs * 4 / total) * 100;
                            const fatCal = (totals.fat * 9 / total) * 100;

                            let offset = 25;
                            const segments = [
                                { pct: proteinCal, color: "#22c55e" },
                                { pct: carbsCal, color: "#3b82f6" },
                                { pct: fatCal, color: "#f59e0b" },
                            ];

                            return segments.map((seg, i) => {
                                const circle = (
                                    <circle
                                        key={i}
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth="3.8"
                                        strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                                        strokeDashoffset={offset}
                                        style={{ transition: "all 0.5s ease" }}
                                    />
                                );
                                offset -= seg.pct;
                                return circle;
                            });
                        })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="text-lg font-bold">{totals.calories}</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
                {macros.map((m) => (
                    <div key={m.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-xs text-gray-500">{m.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FoodItemCard({ item, onRemove }: { item: FoodItem; onRemove: () => void }) {
    return (
        <div className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    {item.brand && (
                        <span className="text-xs text-gray-500 truncate">({item.brand})</span>
                    )}
                </div>
                <p className="text-xs text-gray-500">{item.servingSize}</p>
                <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-emerald-400">{item.protein}g P</span>
                    <span className="text-xs text-blue-400">{item.carbs}g C</span>
                    <span className="text-xs text-amber-400">{item.fat}g F</span>
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="text-lg font-semibold">{item.calories}</div>
                <div className="text-xs text-gray-500">cal</div>
            </div>
            <button
                onClick={onRemove}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default function MealBuilder({ onBack, onOpenSettings }: MealBuilderProps) {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleAddFood = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const apiKey = getApiKey();
        if (!apiKey) {
            onOpenSettings();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64 = reader.result as string;
                    const result = await analyzeMacros(base64, apiKey);

                    const newFood: FoodItem = {
                        id: Date.now().toString(),
                        name: result.food_item.name,
                        brand: result.food_item.brand || undefined,
                        servingSize: result.food_item.serving_size,
                        calories: result.food_item.calories,
                        protein: result.food_item.protein,
                        carbs: result.food_item.carbs,
                        fat: result.food_item.fat,
                        fiber: result.food_item.fiber,
                        sugar: result.food_item.sugar,
                        sodium: result.food_item.sodium,
                        timestamp: Date.now(),
                    };

                    setFoods((prev) => [...prev, newFood]);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to analyze food");
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to read file");
            setIsLoading(false);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [onOpenSettings]);

    const handleRemoveFood = (id: string) => {
        setFoods((prev) => prev.filter((f) => f.id !== id));
    };

    const handleClearAll = () => {
        setFoods([]);
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="icon-btn"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold gradient-text">Meal Builder</h2>
                <button
                    onClick={onOpenSettings}
                    className="icon-btn"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            <p className="text-center text-gray-400 text-sm">
                Scan food labels while cooking to track your meal&apos;s macros
            </p>

            {/* Macro Chart */}
            <MacroChart totals={totals} />

            {/* Add Food Button */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleAddFood}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="btn-primary w-full pulse-glow"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Food Item
                    </>
                )}
            </button>

            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Food List */}
            {foods.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-400">
                            Added Items ({foods.length})
                        </h3>
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                    {foods.map((food) => (
                        <FoodItemCard
                            key={food.id}
                            item={food}
                            onRemove={() => handleRemoveFood(food.id)}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {foods.length === 0 && !isLoading && (
                <div className="glass-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h4 className="font-medium mb-1">Start Building Your Meal</h4>
                    <p className="text-sm text-gray-500">
                        Scan nutrition labels or whole foods to track macros
                    </p>
                </div>
            )}
        </div>
    );
}
