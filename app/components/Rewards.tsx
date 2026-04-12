"use client";

import type { UserProgress } from "../types";
import { ACHIEVEMENTS, xpForLevel, xpProgress } from "../lib/store";

interface RewardsProps {
  progress: UserProgress;
}

export default function Rewards({ progress }: RewardsProps) {
  const xpProg = xpProgress(progress.xp);
  const xpNeeded = xpForLevel(progress.level);
  const xpCurrent = Math.round(xpProg * xpNeeded);

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="py-4 sticky top-0 z-10" style={{ background: "var(--bg-primary)" }}>
        <h1 className="text-title" style={{ color: "var(--text-primary)" }}>🏆 Rewards</h1>
      </div>

      {/* Level Card */}
      <div className="card-accent text-center" style={{ marginBottom: "var(--space-xl)" }}>
        <div className="text-5xl mb-4">⚡</div>
        <h2 className="shimmer-text text-display" style={{ marginBottom: "var(--space-sm)" }}>Level {progress.level}</h2>
        <p className="text-small" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)" }}>
          {progress.xp} total XP
        </p>
        <div className="macro-bar mx-auto" style={{ maxWidth: 300 }}>
          <div className="macro-bar-fill" style={{ width: `${Math.round(xpProg * 100)}%`, background: "var(--accent)" }} />
        </div>
        <p className="text-caption" style={{ color: "var(--text-muted)", marginTop: "var(--space-sm)" }}>
          {xpCurrent} / {xpNeeded} XP to level {progress.level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
        {[
          { icon: "🔥", value: progress.currentStreak, label: "Current Streak" },
          { icon: "🏅", value: progress.longestStreak, label: "Best Streak" },
          { icon: "🍽️", value: progress.totalMealsLogged, label: "Meals Logged" },
          { icon: "📅", value: progress.totalDaysLogged, label: "Days Active" },
        ].map((stat, i) => (
          <div key={i} className="stat-box">
            <p className="text-2xl" style={{ marginBottom: "var(--space-sm)" }}>{stat.icon}</p>
            <p className="text-display" style={{ color: "var(--text-primary)", fontSize: "1.75rem", marginBottom: "var(--space-xs)" }}>{stat.value}</p>
            <p className="text-caption" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* XP Guide */}
      <div className="glass-card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)", fontWeight: 700 }}>How to earn XP</h3>
        <div>
          {[
            { action: "Log a meal", xp: "+15 XP", icon: "🍽️" },
            { action: "Log on a new day", xp: "+25 XP", icon: "📅" },
            { action: "Hit water goal", xp: "+20 XP", icon: "💧" },
            { action: "Stay within calorie goal", xp: "+30 XP", icon: "🎯" },
          ].map((item, i) => (
            <div key={i} className="list-row">
              <span className="text-xl" style={{ width: 32, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span className="text-small" style={{ color: "var(--text-primary)", flex: 1 }}>{item.action}</span>
              <span className="text-small" style={{ color: "var(--accent)", fontWeight: 700 }}>{item.xp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-small" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)", fontWeight: 700 }}>Achievements</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className="glass-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-md)",
                  opacity: unlocked ? 1 : 0.4,
                  borderColor: unlocked ? "rgba(184, 184, 112, 0.2)" : "var(--border)",
                }}
              >
                <span className="text-2xl" style={{ filter: unlocked ? "none" : "grayscale(1)", width: 40, textAlign: "center", flexShrink: 0 }}>
                  {ach.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p className="text-small" style={{ color: unlocked ? "var(--accent)" : "var(--text-muted)", fontWeight: 700, marginBottom: 2 }}>{ach.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>{ach.description}</p>
                </div>
                {unlocked && (
                  <span className="text-small" style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
