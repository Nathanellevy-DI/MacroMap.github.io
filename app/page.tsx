"use client";

import { useState, useEffect, useCallback } from "react";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import LogFood from "./components/LogFood";
import MyFoods from "./components/MyFoods";
import Settings from "./components/Settings";
import Rewards from "./components/Rewards";
import type { DayLog, UserSettings, UserProgress, PersonalFood, LogEntry, Achievement } from "./types";
import {
  getDayLog, addLogEntry, removeLogEntry, updateWater,
  getSettings, saveSettings,
  getProgress, saveProgress, processMealLog, awardBonusXP, checkAchievements,
  savePersonalFood, updateFoodLastUsed, dateToKey,
} from "./lib/store";

type NavTab = "dashboard" | "log" | "foods" | "rewards" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [showLogOverlay, setShowLogOverlay] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayLog, setDayLog] = useState<DayLog>({ entries: [], water: 0 });
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Achievement popup
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  // Level up popup
  const [leveledUp, setLeveledUp] = useState(false);

  const dateKey = dateToKey(currentDate);

  // Load data on mount
  useEffect(() => {
    setSettings(getSettings());
    setProgress(getProgress());
    setIsLoaded(true);
  }, []);

  // Reload day log when date changes
  useEffect(() => {
    if (isLoaded) {
      setDayLog(getDayLog(dateKey));
    }
  }, [dateKey, isLoaded]);

  const refreshDayLog = useCallback(() => {
    setDayLog(getDayLog(dateKey));
  }, [dateKey]);

  if (!isLoaded || !settings || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center fade-in">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="shimmer-text text-title">MacroMap</h1>
        </div>
      </div>
    );
  }

  // Handle tab changes
  const handleTabChange = (tab: NavTab) => {
    if (tab === "log") {
      setShowLogOverlay(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Handle date navigation
  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  /**
   * Centralized: unlock achievements + show popup.
   * Always reads fresh from localStorage to avoid stale state.
   */
  const processAchievements = (updatedProgress: UserProgress) => {
    const freshProgress = { ...updatedProgress };
    const newAchievements = checkAchievements(freshProgress);
    if (newAchievements.length > 0) {
      freshProgress.unlockedAchievements = [
        ...freshProgress.unlockedAchievements,
        ...newAchievements.map(a => a.id),
      ];
      saveProgress(freshProgress);
      setProgress(freshProgress);
      setNewAchievement(newAchievements[0]);
      setTimeout(() => setNewAchievement(null), 4000);
    }
    return freshProgress;
  };

  // Handle water update
  const handleUpdateWater = (delta: number) => {
    const newWater = updateWater(dateKey, delta);
    setDayLog(prev => ({ ...prev, water: newWater }));

    // Award +20 XP when user hits water goal for the first time today
    if (newWater >= settings.waterGoal && (newWater - delta) < settings.waterGoal) {
      const result = awardBonusXP(progress, 20);
      saveProgress(result.progress);
      setProgress(result.progress);
      if (result.leveledUp) setLeveledUp(true);
      processAchievements(result.progress);
    }
  };

  // Handle deleting a log entry
  const handleDeleteEntry = (entryId: string) => {
    removeLogEntry(dateKey, entryId);
    refreshDayLog();
  };

  // Handle logging food — the core gamification trigger
  const handleLog = (entry: Omit<LogEntry, "id" | "timestamp">, saveAsFood?: PersonalFood) => {
    const fullEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    // 1. Persist the log entry
    addLogEntry(dateKey, fullEntry);
    refreshDayLog();

    // 2. Save to personal foods if requested
    if (saveAsFood) {
      savePersonalFood(saveAsFood);
    }

    // 3. Update food's lastUsed if it came from personal foods
    if (entry.foodId) {
      updateFoodLastUsed(entry.foodId);
    }

    // 4. Process meal → awards +15 XP (+ 25 bonus for new day), updates streak
    const result = processMealLog(progress, dateKey);
    let latestProgress = result.progress;

    // 5. Check calorie goal bonus: +30 XP if within ±10% of calorie goal
    const updatedLog = getDayLog(dateKey);
    const totalCals = updatedLog.entries.reduce((s, e) => s + e.calories, 0);
    if (totalCals >= settings.calorieGoal * 0.9 && totalCals <= settings.calorieGoal * 1.1) {
      const bonus = awardBonusXP(latestProgress, 30);
      latestProgress = bonus.progress;
      if (bonus.leveledUp) setLeveledUp(true);
    }

    // 6. Save progress
    saveProgress(latestProgress);
    setProgress(latestProgress);
    if (result.leveledUp) setLeveledUp(true);

    // 7. Check achievements
    processAchievements(latestProgress);

    // 8. Close overlay
    setShowLogOverlay(false);
  };

  // Handle quick log from MyFoods
  const handleQuickLog = (food: PersonalFood) => {
    setShowLogOverlay(true);
  };

  // Handle settings save
  const handleSettingsSave = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        paddingTop: "max(12px, env(safe-area-inset-top))",
        paddingBottom: 80,
      }}
    >
      {/* Main Content */}
      <div className="w-full max-w-xl mx-auto">
        {activeTab === "dashboard" && (
          <Dashboard
            currentDate={currentDate}
            onDateChange={handleDateChange}
            dayLog={dayLog}
            settings={settings}
            progress={progress}
            onUpdateWater={handleUpdateWater}
            onDeleteEntry={handleDeleteEntry}
            onLogClick={() => setShowLogOverlay(true)}
          />
        )}
        {activeTab === "foods" && (
          <MyFoods onQuickLog={handleQuickLog} />
        )}
        {activeTab === "rewards" && (
          <Rewards progress={progress} />
        )}
        {activeTab === "settings" && (
          <Settings settings={settings} onSave={handleSettingsSave} />
        )}
      </div>

      {/* Log Food Overlay */}
      {showLogOverlay && (
        <LogFood
          onClose={() => setShowLogOverlay(false)}
          onLog={handleLog}
        />
      )}

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed bottom-24 left-4 right-4 z-[200] flex justify-center">
          <div
            className="achievement-pop glass-card flex items-center gap-3 max-w-sm w-full"
            style={{ padding: "var(--space-lg)", borderColor: "var(--accent)", boxShadow: "0 8px 32px var(--accent-glow)" }}
          >
            <span className="text-3xl">{newAchievement.icon}</span>
            <div>
              <p className="text-small" style={{ color: "var(--accent)", fontWeight: 700 }}>Achievement Unlocked!</p>
              <p className="text-small" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{newAchievement.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>{newAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Popup */}
      {leveledUp && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="scale-in text-center" style={{ padding: "var(--space-2xl)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "var(--space-md)" }}>⚡</div>
            <h2 className="shimmer-text text-display" style={{ marginBottom: "var(--space-sm)" }}>Level Up!</h2>
            <p className="text-title" style={{ color: "var(--text-primary)", marginBottom: "var(--space-lg)" }}>Level {progress.level}</p>
            <button
              onClick={() => setLeveledUp(false)}
              className="btn btn-primary"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
