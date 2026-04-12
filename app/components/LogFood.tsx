"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { PersonalFood, MealType, LogEntry, FoodType, NutrientProfile } from "../types";
import { NUTRIENT_FIELDS } from "../types";
import { getPersonalFoods, updateFoodLastUsed } from "../lib/store";
import { searchFood, NutritionSearchResult } from "../lib/food-api";

interface LogFoodProps {
  onClose: () => void;
  onLog: (entry: Omit<LogEntry, "id" | "timestamp">, saveAsFood?: PersonalFood) => void;
}

type Tab = "my-foods" | "new" | "scan" | "search";

// Helper: extract all nutrient values from a record, scaling by quantity
function scaleNutrients(food: NutrientProfile, qty: number): NutrientProfile {
  const result: Record<string, number> = {};
  for (const field of NUTRIENT_FIELDS) {
    const val = food[field.key];
    if (val !== undefined && val !== null) {
      result[field.key] = Math.round((val as number) * qty * 100) / 100;
    }
  }
  return result as unknown as NutrientProfile;
}

export default function LogFood({ onClose, onLog }: LogFoodProps) {
  const [activeTab, setActiveTab] = useState<Tab>("my-foods");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [personalFoods, setPersonalFoods] = useState<PersonalFood[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NutritionSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Selected food for quantity entry
  const [selectedFood, setSelectedFood] = useState<PersonalFood | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [quantityUnit, setQuantityUnit] = useState("servings");

  // Manual entry state
  const [manualName, setManualName] = useState("");
  const [manualServing, setManualServing] = useState("1 serving");
  const [manualServingGrams, setManualServingGrams] = useState("");
  const [manualType, setManualType] = useState<FoodType>("food");
  const [saveToFoods, setSaveToFoods] = useState(true);

  // All nutrient values in one record
  const [nutrients, setNutrients] = useState<Record<string, string>>({});

  // Collapsible sections
  const [showMinerals, setShowMinerals] = useState(false);
  const [showVitamins, setShowVitamins] = useState(false);

  useEffect(() => {
    setPersonalFoods(getPersonalFoods());
  }, []);

  const setNutrient = (key: string, value: string) => {
    setNutrients(prev => ({ ...prev, [key]: value }));
  };

  const getNutrient = (key: string): string => nutrients[key] || "";

  // Filter personal foods
  const filteredFoods = searchQuery
    ? personalFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : personalFoods.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));

  // API search
  const handleAPISearch = useCallback(async (query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 2) { setSearchResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchFood(query);
        setSearchResults(results);
      } catch { /* ignore */ } finally {
        setIsSearching(false);
      }
    }, 400);
  }, []);

  // Handle logging from personal food
  const handleLogSelectedFood = () => {
    if (!selectedFood) return;
    let qty = parseFloat(quantity) || 1;
    if (quantityUnit === "g" && selectedFood.servingGrams) {
      qty = qty / selectedFood.servingGrams;
    }
    const scaled = scaleNutrients(selectedFood, qty);

    updateFoodLastUsed(selectedFood.id);
    onLog({
      foodId: selectedFood.id,
      name: selectedFood.name,
      mealType,
      type: selectedFood.type,
      quantity: parseFloat(quantity) || 1,
      quantityUnit,
      ...scaled,
    });
  };

  // Handle logging manual entry
  const handleLogManual = () => {
    if (!manualName || !nutrients.calories) return;

    // Build nutrient profile from form values
    const profile: Record<string, number | undefined> = {};
    for (const field of NUTRIENT_FIELDS) {
      const val = parseFloat(nutrients[field.key] || "");
      if (!isNaN(val)) profile[field.key] = val;
    }

    const foodToSave: PersonalFood | undefined = saveToFoods ? {
      id: Date.now().toString(),
      name: manualName,
      type: manualType,
      servingSize: manualServing,
      servingGrams: manualServingGrams ? parseFloat(manualServingGrams) : undefined,
      calories: profile.calories || 0,
      protein: profile.protein || 0,
      carbs: profile.carbs || 0,
      fat: profile.fat || 0,
      ...profile,
      createdAt: Date.now(),
      timesUsed: 1,
      lastUsed: Date.now(),
    } as PersonalFood : undefined;

    onLog({
      name: manualName,
      mealType,
      type: manualType,
      quantity: 1,
      quantityUnit: "serving",
      calories: profile.calories || 0,
      protein: profile.protein || 0,
      carbs: profile.carbs || 0,
      fat: profile.fat || 0,
      ...profile,
    } as Omit<LogEntry, "id" | "timestamp">, foodToSave);
  };

  // Handle adding from search results
  const handleAddFromSearch = (result: NutritionSearchResult) => {
    setManualName(result.name + (result.brand ? ` (${result.brand})` : ''));
    setManualServing(result.servingSize);
    setNutrients({
      calories: result.calories.toString(),
      protein: result.protein.toString(),
      carbs: result.carbs.toString(),
      fat: result.fat.toString(),
    });
    setManualType("food");
    setSaveToFoods(true);
    setActiveTab("new");
  };

  const macroFields = NUTRIENT_FIELDS.filter(f => f.group === 'macro');
  const mineralFields = NUTRIENT_FIELDS.filter(f => f.group === 'mineral');
  const vitaminFields = NUTRIENT_FIELDS.filter(f => f.group === 'vitamin');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "my-foods", label: "My Foods", icon: "📋" },
    { id: "new", label: "New", icon: "✏️" },
    { id: "scan", label: "Scan", icon: "📷" },
    { id: "search", label: "Search", icon: "🔍" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border)" }}>
        <button onClick={onClose} className="icon-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-heading" style={{ color: "var(--text-primary)" }}>Log Food</h1>
        <div style={{ width: 48 }} />
      </div>

      {/* Meal Type Selector */}
      <div style={{ padding: "var(--space-md) var(--space-lg)", display: "flex", gap: "var(--space-sm)" }}>
        {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((mt) => {
          const icons: Record<MealType, string> = { breakfast: "🍳", lunch: "🥗", dinner: "🍖", snack: "🍎" };
          return (
            <button
              key={mt}
              onClick={() => setMealType(mt)}
              style={{
                flex: 1, padding: "10px 4px", borderRadius: 12, fontSize: "0.8125rem", fontWeight: 700,
                background: mealType === mt ? "var(--accent-soft)" : "transparent",
                color: mealType === mt ? "var(--accent)" : "var(--text-muted)",
                border: mealType === mt ? "1px solid rgba(184,184,112,0.2)" : "1px solid transparent",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {icons[mt]} {mt.charAt(0).toUpperCase() + mt.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 var(--space-lg) var(--space-md)" }}>
        <div className="tabs-container">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSelectedFood(null); setSearchQuery(""); setSearchResults([]); }}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--space-lg) var(--space-xl)" }}>
        {/* MY FOODS TAB */}
        {activeTab === "my-foods" && !selectedFood && (
          <>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your foods..."
              style={{ marginBottom: "var(--space-md)" }}
            />
            {filteredFoods.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-3xl) var(--space-lg)" }}>
                <p style={{ fontSize: "2rem", marginBottom: "var(--space-md)" }}>📋</p>
                <p className="text-small" style={{ color: "var(--text-muted)" }}>
                  {searchQuery ? "No foods found" : "No saved foods yet"}
                </p>
                <button onClick={() => setActiveTab("new")} className="btn btn-ghost" style={{ color: "var(--accent)", marginTop: "var(--space-md)" }}>
                  + Create your first food
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      setSelectedFood(food);
                      setQuantity("1");
                      setQuantityUnit(food.servingGrams ? "g" : "servings");
                    }}
                    className="glass-card"
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-md)", textAlign: "left", width: "100%" }}
                  >
                    <span style={{ fontSize: "1.5rem", width: 40, textAlign: "center", flexShrink: 0 }}>{food.emoji || (food.type === 'drink' ? '🥤' : '🍽️')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>{food.name}</p>
                        <span style={{ fontSize: "0.625rem", padding: "2px 6px", borderRadius: 6, background: food.type === 'drink' ? "rgba(107,141,214,0.1)" : "var(--accent-soft)", color: food.type === 'drink' ? "var(--info)" : "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
                          {food.type || 'food'}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                        {food.servingSize} · {food.calories} cal · {food.protein}g P
                      </p>
                    </div>
                    <svg style={{ width: 16, height: 16, color: "var(--text-muted)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* SELECTED FOOD → QUANTITY ENTRY */}
        {activeTab === "my-foods" && selectedFood && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <button onClick={() => setSelectedFood(null)} className="btn btn-ghost" style={{ color: "var(--accent)", alignSelf: "flex-start" }}>
              ← Back to foods
            </button>

            <div className="glass-card" style={{ textAlign: "center" }}>
              <span style={{ fontSize: "2.5rem" }}>{selectedFood.emoji || (selectedFood.type === 'drink' ? '🥤' : '🍽️')}</span>
              <h3 className="text-heading" style={{ color: "var(--text-primary)", marginTop: "var(--space-sm)" }}>{selectedFood.name}</h3>
              <p className="text-small" style={{ color: "var(--text-muted)" }}>per {selectedFood.servingSize}</p>
            </div>

            {/* Quantity Input */}
            <div className="glass-card">
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>How much?</label>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" style={{ flex: 1 }} min="0" step="0.1" />
                <select value={quantityUnit} onChange={(e) => setQuantityUnit(e.target.value)} style={{ width: 120 }}>
                  <option value="servings">servings</option>
                  {selectedFood.servingGrams && <option value="g">grams</option>}
                  <option value="pieces">pieces</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                {[0.5, 1, 1.5, 2, 3].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q.toString())}
                    style={{
                      flex: 1, padding: "10px 4px", borderRadius: 12, fontSize: "0.875rem", fontWeight: 700,
                      background: quantity === q.toString() ? "var(--accent-soft)" : "var(--bg-input)",
                      color: quantity === q.toString() ? "var(--accent)" : "var(--text-secondary)",
                      border: "1px solid var(--border)", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Macros */}
            {(() => {
              let qty = parseFloat(quantity) || 0;
              if (quantityUnit === "g" && selectedFood.servingGrams) qty = qty / selectedFood.servingGrams;
              const scaled = scaleNutrients(selectedFood, qty);
              return (
                <div className="glass-card">
                  <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
                    <span className="text-display" style={{ color: "var(--text-primary)" }}>{Math.round(scaled.calories)}</span>
                    <span className="text-small" style={{ color: "var(--text-muted)", marginLeft: 8 }}>calories</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                    <div>
                      <div className="text-heading" style={{ color: "var(--protein)", fontWeight: 700 }}>{scaled.protein}g</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Protein</div>
                    </div>
                    <div>
                      <div className="text-heading" style={{ color: "var(--carbs)", fontWeight: 700 }}>{scaled.carbs}g</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Carbs</div>
                    </div>
                    <div>
                      <div className="text-heading" style={{ color: "var(--fat)", fontWeight: 700 }}>{scaled.fat}g</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Fat</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button onClick={handleLogSelectedFood} className="btn btn-primary" style={{ width: "100%" }} disabled={!quantity || parseFloat(quantity) <= 0}>
              Log {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </button>
          </div>
        )}

        {/* NEW FOOD TAB */}
        {activeTab === "new" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Basic Info */}
            <div className="glass-card">
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Food Name *</label>
                <input type="text" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="e.g. Chicken Breast, Green Smoothie" />
              </div>

              {/* Food vs Drink Toggle */}
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Type</label>
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  {(["food", "drink"] as FoodType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setManualType(t)}
                      style={{
                        flex: 1, padding: "14px", borderRadius: 14, fontSize: "0.9375rem", fontWeight: 700,
                        background: manualType === t ? (t === 'drink' ? "rgba(107,141,214,0.1)" : "var(--accent-soft)") : "var(--bg-input)",
                        color: manualType === t ? (t === 'drink' ? "var(--info)" : "var(--accent)") : "var(--text-muted)",
                        border: `1px solid ${manualType === t ? (t === 'drink' ? "rgba(107,141,214,0.2)" : "rgba(184,184,112,0.2)") : "var(--border)"}`,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {t === 'food' ? '🍽️ Food' : '🥤 Drink'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Serving Size</label>
                  <input type="text" value={manualServing} onChange={(e) => setManualServing(e.target.value)} placeholder="e.g. 100g, 1 cup" />
                </div>
                <div style={{ width: 100 }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Grams</label>
                  <input type="number" value={manualServingGrams} onChange={(e) => setManualServingGrams(e.target.value)} placeholder="opt" />
                </div>
              </div>
            </div>

            {/* Core Macros */}
            <div className="glass-card">
              <h4 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>Macronutrients per serving</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                {macroFields.map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: field.color || "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                      {field.label} ({field.unit}) {field.key === 'calories' ? '*' : ''}
                    </label>
                    <input
                      type="number"
                      value={getNutrient(field.key)}
                      onChange={(e) => setNutrient(field.key, e.target.value)}
                      placeholder="0"
                      step={field.key === 'calories' ? '1' : '0.1'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Minerals (Collapsible) */}
            <div className="glass-card" style={{ padding: showMinerals ? "var(--space-lg)" : "var(--space-md) var(--space-lg)" }}>
              <button
                onClick={() => setShowMinerals(!showMinerals)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  padding: showMinerals ? "0 0 var(--space-md)" : 0,
                }}
              >
                <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>⚗️ Essential Minerals</span>
                <svg style={{ width: 16, height: 16, color: "var(--text-muted)", transform: showMinerals ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMinerals && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  {mineralFields.map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                        {field.label} ({field.unit})
                      </label>
                      <input type="number" value={getNutrient(field.key)} onChange={(e) => setNutrient(field.key, e.target.value)} placeholder="0" step="0.1" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vitamins (Collapsible) */}
            <div className="glass-card" style={{ padding: showVitamins ? "var(--space-lg)" : "var(--space-md) var(--space-lg)" }}>
              <button
                onClick={() => setShowVitamins(!showVitamins)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  padding: showVitamins ? "0 0 var(--space-md)" : 0,
                }}
              >
                <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>💊 Essential Vitamins</span>
                <svg style={{ width: 16, height: 16, color: "var(--text-muted)", transform: showVitamins ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showVitamins && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  {vitaminFields.map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                        {field.label} ({field.unit})
                      </label>
                      <input type="number" value={getNutrient(field.key)} onChange={(e) => setNutrient(field.key, e.target.value)} placeholder="0" step="0.01" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save to My Foods toggle */}
            <div className="glass-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>Save to My Foods</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>Re-use this item later</p>
              </div>
              <button
                onClick={() => setSaveToFoods(!saveToFoods)}
                style={{
                  width: 52, height: 28, borderRadius: 14, padding: 3, cursor: "pointer", border: "none",
                  background: saveToFoods ? "var(--accent)" : "var(--border)", transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 11, background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  transform: saveToFoods ? "translateX(24px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }} />
              </button>
            </div>

            <button onClick={handleLogManual} className="btn btn-primary" style={{ width: "100%" }} disabled={!manualName || !nutrients.calories}>
              Log {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </button>
          </div>
        )}

        {/* SCAN TAB */}
        {activeTab === "scan" && (
          <ScanTab
            mealType={mealType}
            onLog={(entry, food) => onLog(entry, food)}
            saveToFoods={saveToFoods}
            setSaveToFoods={setSaveToFoods}
          />
        )}

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); handleAPISearch(e.target.value); }}
              placeholder="Search food database..."
              style={{ marginBottom: "var(--space-md)" }}
            />
            {isSearching && (
              <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-2xl)" }}>
                <div className="spinner" />
              </div>
            )}
            {searchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddFromSearch(r)}
                    className="glass-card"
                    style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", textAlign: "left", width: "100%" }}
                  >
                    {r.image ? (
                      <img src={r.image} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", background: "var(--bg-input)" }}>🍽️</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 500 }}>{r.name}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                        {r.calories} cal · {r.protein}g P · {r.carbs}g C · {r.fat}g F
                      </p>
                    </div>
                    <svg style={{ width: 16, height: 16, flexShrink: 0, color: "var(--accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
            {!searchQuery && !isSearching && (
              <div style={{ textAlign: "center", padding: "var(--space-3xl) var(--space-lg)" }}>
                <p style={{ fontSize: "2rem", marginBottom: "var(--space-md)" }}>🔍</p>
                <p className="text-small" style={{ color: "var(--text-muted)" }}>Search Open Food Facts database</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginTop: 4 }}>Free, no API key needed</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---- Scan Sub-Tab ---- */
function ScanTab({
  mealType, onLog, saveToFoods, setSaveToFoods,
}: {
  mealType: MealType;
  onLog: (entry: Omit<LogEntry, "id" | "timestamp">, saveAsFood?: PersonalFood) => void;
  saveToFoods: boolean;
  setSaveToFoods: (v: boolean) => void;
}) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState<string | null>(null);
  const [ocrLang, setOcrLang] = useState("eng");
  
  // Scanned / edited fields
  const [name, setName] = useState("");
  const [servingSize, setServingSize] = useState("1 serving");
  const [servingsEaten, setServingsEaten] = useState("1");
  const [nutrients, setNutrients] = useState<Record<string, string>>({});

  // Collapsible sections
  const [showMinerals, setShowMinerals] = useState(false);
  const [showVitamins, setShowVitamins] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setNutrient = (key: string, value: string) => {
    setNutrients(prev => ({ ...prev, [key]: value }));
  };

  const getNutrient = (key: string): string => nutrients[key] || "";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setProgress(0);
    try {
      const { scanNutritionLabel } = await import("../lib/ocr");
      const ocrResult = await scanNutritionLabel(file, ocrLang, (pct: number) => setProgress(pct));
      
      setName("");
      setServingSize(ocrResult.servingSize || "1 serving");
      setRawText(ocrResult.rawText);

      // Populate parsed nutrients
      const newNutrients: Record<string, string> = {};
      for (const field of NUTRIENT_FIELDS) {
        const val = ocrResult[field.key as keyof typeof ocrResult];
        if (val !== undefined && val !== null) {
          newNutrients[field.key] = val.toString();
        }
      }
      setNutrients(newNutrients);

      // Auto-expand sections if data was found
      if (ocrResult.sodium || ocrResult.potassium || ocrResult.calcium || ocrResult.iron) {
        setShowMinerals(true);
      }
      if (ocrResult.vitaminA || ocrResult.vitaminC || ocrResult.vitaminD) {
        setShowVitamins(true);
      }
    } catch (err) {
      console.error("OCR error:", err);
      setRawText("OCR failed — please enter values manually");
    } finally {
      setScanning(false);
    }
  };

  const handleLogScanned = () => {
    const servings = parseFloat(servingsEaten) || 1;
    const finalName = name || "Scanned Food";

    // Build nutrient profile from form values
    const profile: Record<string, number | undefined> = {};
    for (const field of NUTRIENT_FIELDS) {
      const val = parseFloat(nutrients[field.key] || "");
      if (!isNaN(val)) profile[field.key] = val;
    }

    const foodToSave: PersonalFood | undefined = saveToFoods ? {
      id: Date.now().toString(),
      name: finalName,
      type: "food",
      servingSize,
      calories: profile.calories || 0,
      protein: profile.protein || 0,
      carbs: profile.carbs || 0,
      fat: profile.fat || 0,
      ...profile,
      createdAt: Date.now(),
      timesUsed: 1,
      lastUsed: Date.now(),
    } as PersonalFood : undefined;

    // Scale nutrients for the log entry based on servings eaten
    const logProfile: Record<string, number | undefined> = {};
    for (const key in profile) {
      logProfile[key] = Math.round((profile[key] || 0) * servings * 100) / 100;
    }

    onLog({
      name: finalName,
      mealType,
      type: "food",
      quantity: servings,
      quantityUnit: "servings",
      calories: logProfile.calories || 0,
      protein: logProfile.protein || 0,
      carbs: logProfile.carbs || 0,
      fat: logProfile.fat || 0,
      ...logProfile,
    } as Omit<LogEntry, "id" | "timestamp">, foodToSave);
  };

  const macroFields = NUTRIENT_FIELDS.filter(f => f.group === 'macro');
  const mineralFields = NUTRIENT_FIELDS.filter(f => f.group === 'mineral');
  const vitaminFields = NUTRIENT_FIELDS.filter(f => f.group === 'vitamin');

  if (scanning) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-3xl) var(--space-lg)" }}>
        <div className="spinner" style={{ margin: "0 auto var(--space-lg)" }} />
        <p className="text-heading" style={{ color: "var(--text-primary)" }}>Scanning label...</p>
        <p className="text-small" style={{ color: "var(--text-muted)", marginTop: "var(--space-sm)" }}>{progress}% complete</p>
        <div className="macro-bar" style={{ marginTop: "var(--space-md)", maxWidth: 240, margin: "var(--space-md) auto 0" }}>
          <div className="macro-bar-fill" style={{ width: `${progress}%`, background: "var(--accent)" }} />
        </div>
      </div>
    );
  }

  if (rawText !== null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        <div className="glass-card">
          <h4 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>Detected Values (edit if needed)</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>Food Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name this food" />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>Serving Size</label>
              <input type="text" value={servingSize} onChange={(e) => setServingSize(e.target.value)} />
            </div>
            
            <h4 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginTop: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>Macronutrients</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              {macroFields.map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: field.color || "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                    {field.label} ({field.unit}) {field.key === 'calories' ? '*' : ''}
                  </label>
                  <input
                    type="number"
                    value={getNutrient(field.key)}
                    onChange={(e) => setNutrient(field.key, e.target.value)}
                    placeholder="0"
                    step={field.key === 'calories' ? '1' : '0.1'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minerals (Collapsible) */}
        <div className="glass-card" style={{ padding: showMinerals ? "var(--space-lg)" : "var(--space-md) var(--space-lg)" }}>
          <button
            onClick={() => setShowMinerals(!showMinerals)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: showMinerals ? "0 0 var(--space-md)" : 0,
            }}
          >
            <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>⚗️ Essential Minerals</span>
            <svg style={{ width: 16, height: 16, color: "var(--text-muted)", transform: showMinerals ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showMinerals && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              {mineralFields.map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                    {field.label} ({field.unit})
                  </label>
                  <input type="number" value={getNutrient(field.key)} onChange={(e) => setNutrient(field.key, e.target.value)} placeholder="0" step="0.1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vitamins (Collapsible) */}
        <div className="glass-card" style={{ padding: showVitamins ? "var(--space-lg)" : "var(--space-md) var(--space-lg)" }}>
          <button
            onClick={() => setShowVitamins(!showVitamins)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: showVitamins ? "0 0 var(--space-md)" : 0,
            }}
          >
            <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>💊 Essential Vitamins</span>
            <svg style={{ width: 16, height: 16, color: "var(--text-muted)", transform: showVitamins ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showVitamins && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              {vitaminFields.map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>
                    {field.label} ({field.unit})
                  </label>
                  <input type="number" value={getNutrient(field.key)} onChange={(e) => setNutrient(field.key, e.target.value)} placeholder="0" step="0.01" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>How many servings did you eat?</label>
          <input type="number" value={servingsEaten} onChange={(e) => setServingsEaten(e.target.value)} min="0.1" step="0.1" />
        </div>
        
        {/* Save to My Foods toggle */}
        <div className="glass-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>Save to My Foods</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>Re-use this item later</p>
          </div>
          <button
            onClick={() => setSaveToFoods(!saveToFoods)}
            style={{
              width: 52, height: 28, borderRadius: 14, padding: 3, cursor: "pointer", border: "none",
              background: saveToFoods ? "var(--accent)" : "var(--border)", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 11, background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transform: saveToFoods ? "translateX(24px)" : "translateX(0)",
              transition: "transform 0.2s",
            }} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <button onClick={() => setRawText(null)} className="btn btn-secondary" style={{ flex: 1 }}>Re-scan</button>
          <button onClick={handleLogScanned} className="btn btn-primary" style={{ flex: 1 }} disabled={!getNutrient('calories')}>Log Food</button>
        </div>

        <details className="glass-card" style={{ padding: "var(--space-md) var(--space-lg)" }}>
          <summary style={{ fontSize: "0.75rem", cursor: "pointer", color: "var(--text-muted)" }}>Raw OCR Text</summary>
          <pre style={{ fontSize: "0.7rem", marginTop: "var(--space-sm)", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {rawText}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "var(--space-3xl) var(--space-lg)" }}>
      <div style={{ width: 80, height: 80, margin: "0 auto var(--space-lg)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", background: "var(--accent-soft)" }}>
        📷
      </div>
      <h3 className="text-heading" style={{ color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>Scan Nutrition Label</h3>
      <p className="text-small" style={{ color: "var(--text-muted)", marginBottom: "var(--space-xl)" }}>
        Take a photo or upload an image of a nutrition facts label in any language
      </p>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Language</label>
        <select value={ocrLang} onChange={(e) => setOcrLang(e.target.value)} style={{ padding: "10px 16px", borderRadius: 12, background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <option value="eng">English</option>
          <option value="heb">Hebrew</option>
          <option value="spa">Spanish</option>
          <option value="fre">French</option>
          <option value="ara">Arabic</option>
        </select>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
      <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center" }}>
        <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary">📷 Take Photo</button>
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
            input.click();
          }}
          className="btn btn-secondary"
        >
          📁 Upload
        </button>
      </div>
    </div>
  );
}
