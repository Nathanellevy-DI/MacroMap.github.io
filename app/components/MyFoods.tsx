"use client";

import { useState } from "react";
import type { PersonalFood } from "../types";
import { getPersonalFoods, deletePersonalFood, savePersonalFood } from "../lib/store";

interface MyFoodsProps {
  onQuickLog: (food: PersonalFood) => void;
}

export default function MyFoods({ onQuickLog }: MyFoodsProps) {
  const [foods, setFoods] = useState<PersonalFood[]>(() => getPersonalFoods());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "alpha" | "used">("recent");
  const [editingFood, setEditingFood] = useState<PersonalFood | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = () => setFoods(getPersonalFoods());

  const sorted = [...foods]
    .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "recent") return (b.lastUsed || b.createdAt) - (a.lastUsed || a.createdAt);
      if (sortBy === "alpha") return a.name.localeCompare(b.name);
      return (b.timesUsed || 0) - (a.timesUsed || 0);
    });

  const handleDelete = (id: string) => {
    deletePersonalFood(id);
    refresh();
    setDeleteConfirm(null);
  };

  const handleSaveEdit = () => {
    if (!editingFood) return;
    savePersonalFood(editingFood);
    refresh();
    setEditingFood(null);
  };

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "var(--space-md)", paddingBottom: "var(--space-md)", position: "sticky", top: 0, zIndex: 10, background: "var(--bg-primary)" }}>
        <h1 className="text-title" style={{ color: "var(--text-primary)" }}>My Foods</h1>
        <span className="text-small" style={{ color: "var(--text-muted)" }}>{foods.length} items</span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your foods..."
        />
      </div>

      {/* Sort */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
        {(["recent", "alpha", "used"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            style={{
              flex: 1, padding: "12px 8px", borderRadius: 12, fontSize: "0.875rem", fontWeight: 700,
              background: sortBy === s ? "var(--accent-soft)" : "var(--bg-input)",
              color: sortBy === s ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${sortBy === s ? "rgba(184,184,112,0.2)" : "var(--border)"}`,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {s === "recent" ? "Recent" : s === "alpha" ? "A-Z" : "Most Used"}
          </button>
        ))}
      </div>

      {/* Food List */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl) var(--space-lg)" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "var(--space-md)" }}>📋</p>
          <p className="text-heading" style={{ color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
            {searchQuery ? "No results" : "No foods saved yet"}
          </p>
          <p className="text-small" style={{ color: "var(--text-muted)" }}>
            {searchQuery ? "Try a different search" : "Foods you log will appear here"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {sorted.map((food) => (
            <div key={food.id} className="glass-card">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                <span style={{ fontSize: "1.75rem" }}>{food.emoji || "🍽️"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>{food.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    {food.servingSize} · {food.calories} cal
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--protein)", fontWeight: 600 }}>{food.protein}p</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--carbs)", fontWeight: 600 }}>{food.carbs}c</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--fat)", fontWeight: 600 }}>{food.fat}f</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button onClick={() => onQuickLog(food)} className="btn btn-primary" style={{ flex: 1, minHeight: 44, padding: "10px 16px", fontSize: "0.8125rem" }}>
                  + Quick Log
                </button>
                <button onClick={() => setEditingFood({ ...food })} className="btn btn-secondary" style={{ minHeight: 44, padding: "10px 14px" }}>
                  ✏️
                </button>
                {deleteConfirm === food.id ? (
                  <button onClick={() => handleDelete(food.id)} className="btn btn-danger" style={{ minHeight: 44, padding: "10px 14px" }}>
                    Confirm
                  </button>
                ) : (
                  <button onClick={() => setDeleteConfirm(food.id)} className="btn btn-ghost" style={{ minHeight: 44, padding: "10px 14px", color: "var(--danger)" }}>
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingFood && (
        <div className="modal-overlay" onClick={() => setEditingFood(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="text-heading" style={{ color: "var(--text-primary)", marginBottom: "var(--space-lg)" }}>Edit Food</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Name</label>
                <input type="text" value={editingFood.name} onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "var(--space-sm)" }}>Serving Size</label>
                <input type="text" value={editingFood.servingSize} onChange={(e) => setEditingFood({ ...editingFood, servingSize: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>Calories</label>
                  <input type="number" value={editingFood.calories} onChange={(e) => setEditingFood({ ...editingFood, calories: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--protein)", display: "block", marginBottom: "var(--space-sm)" }}>Protein</label>
                  <input type="number" value={editingFood.protein} onChange={(e) => setEditingFood({ ...editingFood, protein: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--carbs)", display: "block", marginBottom: "var(--space-sm)" }}>Carbs</label>
                  <input type="number" value={editingFood.carbs} onChange={(e) => setEditingFood({ ...editingFood, carbs: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fat)", display: "block", marginBottom: "var(--space-sm)" }}>Fat</label>
                  <input type="number" value={editingFood.fat} onChange={(e) => setEditingFood({ ...editingFood, fat: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)" }}>
              <button onClick={() => setEditingFood(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleSaveEdit} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
