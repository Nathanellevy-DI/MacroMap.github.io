"use client";

import { useState } from "react";
import type { UserSettings, WeightEntry } from "../types";
import {
  getWeightHistory, addWeightEntry, getStartingWeight, getCurrentWeight, getWeightProgress, getWeightTimeElapsed,
  exportAllData, importAllData, clearAllData,
} from "../lib/store";
import ThemeToggle from "./ThemeToggle";

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export default function Settings({ settings, onSave }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings });
  const [weightInput, setWeightInput] = useState("");
  const [weightNotes, setWeightNotes] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => getWeightHistory());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const startWeight = getStartingWeight();
  const currentWeight = getCurrentWeight();
  const weightChange = getWeightProgress();
  const timeElapsed = getWeightTimeElapsed();

  const handleLogWeight = () => {
    const w = parseFloat(weightInput);
    if (!w || w <= 0) return;
    addWeightEntry(w, weightNotes);
    setWeightHistory(getWeightHistory());
    setWeightInput("");
    setWeightNotes("");
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `macromap-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (importAllData(text)) {
          setImportStatus("✅ Data imported successfully! Reload to see changes.");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus("❌ Import failed — invalid file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    clearAllData();
    window.location.reload();
  };

  const handleProfilePic = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const pic = ev.target?.result as string;
        update({ profilePicture: pic });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const update = (partial: Partial<UserSettings>) => {
    const next = { ...localSettings, ...partial };
    setLocalSettings(next);
    onSave(next);
  };

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "var(--space-md)", paddingBottom: "var(--space-md)", position: "sticky", top: 0, zIndex: 10, background: "var(--bg-primary)" }}>
        <h1 className="text-title" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <ThemeToggle />
      </div>

      {/* Profile */}
      <div className="card-accent" style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
          <button
            onClick={handleProfilePic}
            style={{
              width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: 700, overflow: "hidden",
              background: "var(--bg-card)", border: "2px solid var(--accent)", cursor: "pointer", flexShrink: 0,
            }}
          >
            {localSettings.profilePicture ? (
              <img src={localSettings.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : "📷"}
          </button>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={localSettings.name}
              onChange={(e) => update({ name: e.target.value })}
              style={{
                fontSize: "1.125rem", fontWeight: 600, background: "transparent", border: "none",
                boxShadow: "none", padding: 0, color: "var(--text-primary)", width: "100%",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5, marginTop: 4 }}>Tap to edit name · tap photo to change</p>
          </div>
        </div>
      </div>

      {/* Weight Tracking */}
      <div className="glass-card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>⚖️ Weight Tracking</h3>

        {/* Weight Stats */}
        {currentWeight !== null && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
            <div className="stat-box">
              <p className="text-heading" style={{ color: "var(--text-primary)", fontWeight: 700 }}>{startWeight || "—"}</p>
              <p className="text-caption" style={{ color: "var(--text-muted)" }}>Origin Weight</p>
            </div>
            <div className="stat-box">
              <p className="text-heading" style={{ color: "var(--text-primary)", fontWeight: 700 }}>{currentWeight}</p>
              <p className="text-caption" style={{ color: "var(--text-muted)" }}>Current</p>
            </div>
            <div className="stat-box">
              <p className="text-heading" style={{ color: weightChange !== null && weightChange < 0 ? "var(--success)" : weightChange !== null && weightChange > 0 ? "var(--danger)" : "var(--text-primary)", fontWeight: 700 }}>
                {weightChange !== null ? (weightChange > 0 ? "+" : "") + weightChange.toFixed(1) : "—"}
              </p>
              <p className="text-caption" style={{ color: "var(--text-muted)" }}>Total Progress</p>
            </div>
          </div>
        )}
        {startWeight !== null && (
          <p className="text-small" style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "var(--space-lg)" }}>
            Tracking for {timeElapsed}
          </p>
        )}

        {/* Log Weight */}
        <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={`Weight (${localSettings.weightUnit})`}
              step="0.1"
            />
            <input
              type="text"
              value={weightNotes}
              onChange={(e) => setWeightNotes(e.target.value)}
              placeholder="Notes (optional)..."
              style={{ fontSize: "0.875rem", padding: "12px 16px" }}
            />
          </div>
          <button onClick={handleLogWeight} className="btn btn-primary" disabled={!weightInput} style={{ height: "100%", padding: "16px 24px" }}>
            Log
          </button>
        </div>

        {/* Weight Unit */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
          <span className="text-small" style={{ color: "var(--text-secondary)" }}>Unit</span>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            {(["lbs", "kg"] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ weightUnit: u })}
                style={{
                  padding: "8px 16px", borderRadius: 12, fontSize: "0.875rem", fontWeight: 700,
                  background: localSettings.weightUnit === u ? "var(--accent)" : "var(--bg-input)",
                  color: localSettings.weightUnit === u ? "#0A0A0A" : "var(--text-muted)",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Weight History */}
        {weightHistory.length > 0 && (
          <details>
            <summary className="text-caption" style={{ color: "var(--accent)", cursor: "pointer" }}>View history ({weightHistory.length} entries)</summary>
            <div style={{ marginTop: "var(--space-md)", maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {[...weightHistory].reverse().map((entry, i) => (
                <div key={entry.id || i} className="glass-card" style={{ padding: "var(--space-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>{entry.date}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1rem" }}>{entry.weight} {localSettings.weightUnit}</span>
                  </div>
                  {entry.notes && (
                    <div style={{ marginTop: "var(--space-xs)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Daily Goals */}
      <div className="glass-card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>🎯 Daily Goals</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "var(--space-sm)" }}>Calories</label>
            <input type="number" value={localSettings.calorieGoal} onChange={(e) => update({ calorieGoal: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--protein)", display: "block", marginBottom: "var(--space-sm)" }}>Protein (g)</label>
            <input type="number" value={localSettings.proteinGoal} onChange={(e) => update({ proteinGoal: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--carbs)", display: "block", marginBottom: "var(--space-sm)" }}>Carbs (g)</label>
            <input type="number" value={localSettings.carbsGoal} onChange={(e) => update({ carbsGoal: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fat)", display: "block", marginBottom: "var(--space-sm)" }}>Fat (g)</label>
            <input type="number" value={localSettings.fatGoal} onChange={(e) => update({ fatGoal: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      {/* Water Settings */}
      <div className="glass-card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>💧 Water Goal</h3>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <input type="number" value={localSettings.waterGoal} onChange={(e) => update({ waterGoal: parseInt(e.target.value) || 0 })} style={{ flex: 1 }} />
          <input 
            type="text" 
            value={localSettings.waterUnit} 
            onChange={(e) => update({ waterUnit: e.target.value })} 
            placeholder="glasses, ml, L, cups..."
            style={{ width: 130 }} 
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card">
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>💾 Data</h3>
        <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <button onClick={handleExport} className="btn btn-secondary" style={{ flex: 1 }}>📤 Export</button>
          <button onClick={handleImport} className="btn btn-secondary" style={{ flex: 1 }}>📥 Import</button>
        </div>
        {importStatus && (
          <p className="text-small" style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "var(--space-md)" }}>{importStatus}</p>
        )}
        {showClearConfirm ? (
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button onClick={handleClear} className="btn btn-danger" style={{ flex: 1 }}>⚠️ Confirm Clear</button>
          </div>
        ) : (
          <button onClick={() => setShowClearConfirm(true)} className="btn btn-danger" style={{ width: "100%" }}>
            🗑️ Clear All Data
          </button>
        )}
      </div>
    </div>
  );
}
