"use client";

import { useState } from "react";
import type { DayLog, UserSettings, MacroTotals, UserProgress } from "../types";
import { xpForLevel, xpProgress } from "../lib/store";
import ThemeToggle from "./ThemeToggle";

interface DashboardProps {
  currentDate: Date;
  onDateChange: (days: number) => void;
  dayLog: DayLog;
  settings: UserSettings;
  progress: UserProgress;
  onUpdateWater: (delta: number) => void;
  onDeleteEntry: (entryId: string) => void;
  onLogClick: () => void;
}

export default function Dashboard({
  currentDate, onDateChange, dayLog, settings, progress,
  onUpdateWater, onDeleteEntry, onLogClick,
}: DashboardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Calculate totals
  const totals: MacroTotals = dayLog.entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const caloriesLeft = Math.max(0, settings.calorieGoal - totals.calories);
  const calProgress = Math.min((totals.calories / settings.calorieGoal) * 100, 100);
  const waterProgress = Math.min((dayLog.water / settings.waterGoal) * 100, 100);
  const isOverBudget = totals.calories > settings.calorieGoal;

  // Ring math
  const calRadius = 90;
  const calCircumference = 2 * Math.PI * calRadius;
  const calStrokeOffset = calCircumference - (calProgress / 100) * calCircumference;

  const waterRadius = 106;
  const waterCircumference = 2 * Math.PI * waterRadius;
  const waterStrokeOffset = waterCircumference - (waterProgress / 100) * waterCircumference;

  // Date formatting
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday
    ? "Today"
    : currentDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  // Group entries by meal type
  const mealGroups: Record<string, typeof dayLog.entries> = {};
  for (const entry of dayLog.entries) {
    if (!mealGroups[entry.mealType]) mealGroups[entry.mealType] = [];
    mealGroups[entry.mealType].push(entry);
  }
  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];
  const mealIcons: Record<string, string> = { breakfast: "🍳", lunch: "🥗", dinner: "🍖", snack: "🍎" };
  const mealLabels: Record<string, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };

  // XP bar
  const xpProg = xpProgress(progress.xp);
  const xpNeeded = xpForLevel(progress.level);
  const xpCurrent = Math.round(xpProg * xpNeeded);

  return (
    <div className="page-container fade-in">
      {/* Date Header + Theme Toggle */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-md)",
          paddingBottom: "var(--space-md)",
        }}
      >
        <button onClick={() => onDateChange(-1)} className="icon-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontWeight: 600, color: "var(--text-primary)" }}>
          <svg className="w-4 h-4" style={{ color: "var(--accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {dateLabel}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <ThemeToggle />
          <button onClick={() => onDateChange(1)} className="icon-btn">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Level & Streak Bar */}
      <div className="card-accent" style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <span className="text-lg">⚡</span>
            <span className="text-small" style={{ color: "var(--accent)", fontWeight: 700 }}>Level {progress.level}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <span className="text-lg">🔥</span>
            <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
              {progress.currentStreak} day streak
            </span>
          </div>
        </div>
        <div className="macro-bar">
          <div className="macro-bar-fill" style={{ width: `${Math.round(xpProg * 100)}%`, background: "var(--accent)" }} />
        </div>
        <p className="text-caption" style={{ color: "var(--text-muted)", marginTop: "var(--space-sm)" }}>
          {xpCurrent} / {xpNeeded} XP to level {progress.level + 1}
        </p>
      </div>

      {/* Calorie + Water Rings */}
      <div className="glass-card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 280 280">
              {/* Water Ring (Outer) */}
              <g transform="rotate(-90 140 140)">
                <circle cx="140" cy="140" r={waterRadius} stroke="var(--border)" strokeWidth="10" fill="none" />
                <circle
                  cx="140" cy="140" r={waterRadius}
                  stroke="var(--info)" strokeWidth="10" strokeLinecap="round" fill="none"
                  strokeDasharray={waterCircumference}
                  strokeDashoffset={waterStrokeOffset}
                  style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                />
              </g>
              {/* Calorie Ring (Inner) */}
              <g transform="rotate(-90 140 140)">
                <circle cx="140" cy="140" r={calRadius} stroke="var(--border)" strokeWidth="20" fill="none" />
                <circle
                  cx="140" cy="140" r={calRadius}
                  stroke={isOverBudget ? "var(--danger)" : "var(--accent)"}
                  strokeWidth="20" strokeLinecap="round" fill="none"
                  strokeDasharray={calCircumference}
                  strokeDashoffset={calStrokeOffset}
                  style={{ transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease" }}
                />
              </g>
            </svg>
            {/* Center Content */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <span className="text-display" style={{ color: "var(--text-primary)" }}>{caloriesLeft}</span>
              <span className="text-small" style={{ color: "var(--text-muted)" }}>cal left</span>
            </div>
          </div>
        </div>

        {/* Ring Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)", marginTop: "var(--space-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: isOverBudget ? "var(--danger)" : "var(--accent)" }} />
            <span className="text-small" style={{ color: "var(--text-secondary)" }}>{totals.calories} / {settings.calorieGoal} cal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--info)" }} />
            <span className="text-small" style={{ color: "var(--text-secondary)" }}>{dayLog.water} / {settings.waterGoal} {settings.waterUnit}</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
          <button onClick={onLogClick} className="btn btn-primary" id="dashboard-log-btn">
            + Log a Meal
          </button>
        </div>
      </div>

      {/* Macro Bars */}
      <div className="glass-card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>Macros</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {[
            { label: "Protein", value: totals.protein, goal: settings.proteinGoal, color: "var(--protein)" },
            { label: "Carbs", value: totals.carbs, goal: settings.carbsGoal, color: "var(--carbs)" },
            { label: "Fat", value: totals.fat, goal: settings.fatGoal, color: "var(--fat)" },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", alignItems: "center" }}>
                <span className="text-small" style={{ color: m.color, fontWeight: 600 }}>{m.label}</span>
                <span className="text-small" style={{ color: "var(--text-muted)" }}>
                  {Math.round(m.value)}g / {m.goal}g
                </span>
              </div>
              <div className="macro-bar">
                <div className="macro-bar-fill" style={{ width: `${Math.min((m.value / m.goal) * 100, 100)}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Tracker */}
      <div className="glass-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-xl)", borderColor: "rgba(107, 141, 214, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <span style={{ fontSize: "1.5rem" }}>💧</span>
          <div>
            <h3 className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>Water</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
              Goal: {settings.waterGoal} {settings.waterUnit}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <button onClick={() => onUpdateWater(-1)} className="icon-btn" style={{ width: 40, height: 40, fontSize: 18 }}>−</button>
          <span className="text-heading" style={{ color: "var(--text-primary)", fontWeight: 700, width: 32, textAlign: "center" }}>
            {dayLog.water}
          </span>
          <button onClick={() => onUpdateWater(1)} className="icon-btn" style={{ width: 40, height: 40, fontSize: 18, background: "var(--accent)", color: "#0A0A0A", borderColor: "var(--accent)" }}>+</button>
        </div>
      </div>

      {/* Today's Meals */}
      <div>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "var(--space-md)" }}>
          {isToday ? "Today's Meals" : "Meals"}
        </h3>

        {dayLog.entries.length === 0 ? (
          <div className="glass-card" style={{ textAlign: "center", padding: "var(--space-2xl) var(--space-lg)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "var(--space-md)" }}>🍽️</p>
            <p className="text-small" style={{ color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>No meals logged yet</p>
            <button onClick={onLogClick} className="btn btn-ghost" style={{ color: "var(--accent)" }}>
              + Add your first meal
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {mealOrder.map((mealType) => {
              const entries = mealGroups[mealType];
              if (!entries || entries.length === 0) return null;
              const mealCals = entries.reduce((s, e) => s + e.calories, 0);

              return (
                <div key={mealType} className="glass-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                      <span style={{ fontSize: "1.25rem" }}>{mealIcons[mealType]}</span>
                      <span className="text-small" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                        {mealLabels[mealType]}
                      </span>
                    </div>
                    <span className="text-small" style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {Math.round(mealCals)} cal
                    </span>
                  </div>
                  <div>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="list-row"
                        style={{ padding: "var(--space-md) 0" }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                            {entry.name}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                            {entry.quantity} {entry.quantityUnit} · {Math.round(entry.protein)}p · {Math.round(entry.carbs)}c · {Math.round(entry.fat)}f
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                          <span className="text-small" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
                            {Math.round(entry.calories)}
                          </span>
                          {deleteConfirm === entry.id ? (
                            <button
                              onClick={() => { onDeleteEntry(entry.id); setDeleteConfirm(null); }}
                              style={{ fontSize: "0.75rem", padding: "6px 12px", borderRadius: 8, background: "var(--danger-soft)", color: "var(--danger)", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                            >
                              Delete?
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(entry.id)}
                              style={{ padding: 8, borderRadius: 8, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}
                            >
                              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
