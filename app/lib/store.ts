/* ============================================
   MacroMap — localStorage Data Store
   ============================================ */

import type { PersonalFood, LogEntry, DayLog, UserSettings, UserProgress, WeightEntry, Achievement } from '../types';

// ---- Keys ----
const FOODS_KEY = 'mm_foods';
const LOGS_KEY = 'mm_logs';
const SETTINGS_KEY = 'mm_settings';
const PROGRESS_KEY = 'mm_progress';
const WEIGHT_KEY = 'mm_weight_history';

// ---- Helpers ----
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Date helpers ----
export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function dateToKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

// ---- Default Settings ----
export const DEFAULT_SETTINGS: UserSettings = {
  name: 'User',
  calorieGoal: 2000,
  proteinGoal: 150,
  carbsGoal: 200,
  fatGoal: 65,
  waterGoal: 8,
  waterUnit: 'glasses',
  weightUnit: 'lbs',
  darkMode: true,
};

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  totalMealsLogged: 0,
  totalDaysLogged: 0,
  lastLogDate: null,
  unlockedAchievements: [],
  originWeight: null,
  startDate: null,
};

// ============================================
// Personal Foods CRUD
// ============================================

export function getPersonalFoods(): PersonalFood[] {
  return read<PersonalFood[]>(FOODS_KEY, []);
}

export function savePersonalFood(food: PersonalFood): void {
  const foods = getPersonalFoods();
  // Ensure type field has a default
  if (!food.type) food.type = 'food';
  const idx = foods.findIndex(f => f.id === food.id);
  if (idx >= 0) {
    foods[idx] = food;
  } else {
    foods.push(food);
  }
  write(FOODS_KEY, foods);
}

export function deletePersonalFood(id: string): void {
  const foods = getPersonalFoods().filter(f => f.id !== id);
  write(FOODS_KEY, foods);
}

export function updateFoodLastUsed(id: string): void {
  const foods = getPersonalFoods();
  const food = foods.find(f => f.id === id);
  if (food) {
    food.lastUsed = Date.now();
    food.timesUsed = (food.timesUsed || 0) + 1;
    write(FOODS_KEY, foods);
  }
}

// ============================================
// Day Logs CRUD
// ============================================

export function getAllLogs(): Record<string, DayLog> {
  return read<Record<string, DayLog>>(LOGS_KEY, {});
}

export function getDayLog(dateKey: string): DayLog {
  const logs = getAllLogs();
  return logs[dateKey] || { entries: [], water: 0 };
}

export function addLogEntry(dateKey: string, entry: LogEntry): void {
  const logs = getAllLogs();
  if (!logs[dateKey]) {
    logs[dateKey] = { entries: [], water: 0 };
  }
  logs[dateKey].entries.push(entry);
  write(LOGS_KEY, logs);
}

export function removeLogEntry(dateKey: string, entryId: string): void {
  const logs = getAllLogs();
  if (logs[dateKey]) {
    logs[dateKey].entries = logs[dateKey].entries.filter(e => e.id !== entryId);
    write(LOGS_KEY, logs);
  }
}

export function updateWater(dateKey: string, delta: number): number {
  const logs = getAllLogs();
  if (!logs[dateKey]) {
    logs[dateKey] = { entries: [], water: 0 };
  }
  logs[dateKey].water = Math.max(0, (logs[dateKey].water || 0) + delta);
  write(LOGS_KEY, logs);
  return logs[dateKey].water;
}

// ============================================
// Settings
// ============================================

export function getSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<UserSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: UserSettings): void {
  write(SETTINGS_KEY, settings);
}

// ============================================
// Progress / Gamification
// ============================================

export function getProgress(): UserProgress {
  return { ...DEFAULT_PROGRESS, ...read<Partial<UserProgress>>(PROGRESS_KEY, {}) };
}

export function saveProgress(progress: UserProgress): void {
  write(PROGRESS_KEY, progress);
}

/** XP required for a given level */
export function xpForLevel(level: number): number {
  return level * 100;
}

/** Calculate level from total XP */
export function levelFromXP(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

/** XP progress within current level (0-1) */
export function xpProgress(xp: number): number {
  let remaining = xp;
  let level = 1;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return remaining / xpForLevel(level);
}

/**
 * Process a meal log event — awards XP, updates streak, increments counters.
 * This is the SINGLE function to call when a user logs food.
 *
 * XP breakdown:
 *   +15 — log any meal
 *   +25 — first log of a new day (bonus)
 *
 * Streak logic:
 *   - If the date is the same as lastLogDate → no streak change
 *   - If the date is exactly 1 day after lastLogDate → streak++
 *   - If it's the very first log ever → streak = 1
 *   - Otherwise → streak resets to 1
 */
export function processMealLog(
  progress: UserProgress,
  dateKey: string
): { progress: UserProgress; leveledUp: boolean; isNewDay: boolean } {
  const prevLevel = progress.level;
  const p = { ...progress };

  const isNewDay = p.lastLogDate !== dateKey;

  // Always: +15 XP for logging a meal, +1 meal count
  p.xp += 15;
  p.totalMealsLogged += 1;

  // If this is a new day we haven't logged on yet…
  if (isNewDay) {
    // Bonus +25 XP for new day
    p.xp += 25;
    p.totalDaysLogged += 1;

    // Streak logic
    const yesterday = new Date(dateKey);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = dateToKey(yesterday);

    if (p.lastLogDate === yesterdayKey) {
      // Consecutive day → extend streak
      p.currentStreak += 1;
    } else if (p.lastLogDate === null) {
      // Very first log ever
      p.currentStreak = 1;
    } else {
      // Streak broken (gap of ≥2 days)
      p.currentStreak = 1;
    }

    p.longestStreak = Math.max(p.longestStreak, p.currentStreak);
    p.lastLogDate = dateKey;
  }

  // Recalculate level from total XP
  p.level = levelFromXP(p.xp);
  const leveledUp = p.level > prevLevel;

  return { progress: p, leveledUp, isNewDay };
}

/**
 * Award bonus XP for hitting a goal (water, calorie target, etc).
 * Does NOT increment meals or modify streak.
 */
export function awardBonusXP(
  progress: UserProgress,
  xpAmount: number
): { progress: UserProgress; leveledUp: boolean } {
  const prevLevel = progress.level;
  const p = { ...progress };
  p.xp += xpAmount;
  p.level = levelFromXP(p.xp);
  return { progress: p, leveledUp: p.level > prevLevel };
}

// ============================================
// Achievements
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_meal', name: 'First Bite', description: 'Log your first meal', icon: '🍽️', requirement: (p) => p.totalMealsLogged >= 1 },
  { id: 'meals_10', name: 'Getting Started', description: 'Log 10 meals', icon: '🔥', requirement: (p) => p.totalMealsLogged >= 10 },
  { id: 'meals_50', name: 'Dedicated', description: 'Log 50 meals', icon: '💪', requirement: (p) => p.totalMealsLogged >= 50 },
  { id: 'meals_100', name: 'Centurion', description: 'Log 100 meals', icon: '🏆', requirement: (p) => p.totalMealsLogged >= 100 },
  { id: 'meals_500', name: 'Legend', description: 'Log 500 meals', icon: '👑', requirement: (p) => p.totalMealsLogged >= 500 },
  { id: 'streak_3', name: 'Hat Trick', description: '3-day streak', icon: '🎯', requirement: (p) => p.longestStreak >= 3 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚡', requirement: (p) => p.longestStreak >= 7 },
  { id: 'streak_14', name: 'Two Weeks Strong', description: '14-day streak', icon: '🌟', requirement: (p) => p.longestStreak >= 14 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '💎', requirement: (p) => p.longestStreak >= 30 },
  { id: 'streak_100', name: 'Unstoppable', description: '100-day streak', icon: '🔱', requirement: (p) => p.longestStreak >= 100 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', requirement: (p) => p.level >= 5 },
  { id: 'level_10', name: 'Veteran', description: 'Reach level 10', icon: '🌙', requirement: (p) => p.level >= 10 },
  { id: 'level_25', name: 'Elite', description: 'Reach level 25', icon: '🏅', requirement: (p) => p.level >= 25 },
  { id: 'days_7', name: 'First Week', description: 'Log on 7 different days', icon: '📅', requirement: (p) => p.totalDaysLogged >= 7 },
  { id: 'days_30', name: 'Monthly Logger', description: 'Log on 30 different days', icon: '📆', requirement: (p) => p.totalDaysLogged >= 30 },
];

/** Check for newly unlocked achievements */
export function checkAchievements(progress: UserProgress): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!progress.unlockedAchievements.includes(ach.id) && ach.requirement(progress)) {
      newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

// ============================================
// Weight History
// ============================================

export function getWeightHistory(): WeightEntry[] {
  return read<WeightEntry[]>(WEIGHT_KEY, []);
}

export function addWeightEntry(weight: number, notes?: string, date?: string): WeightEntry {
  const history = getWeightHistory();
  const entryDate = date || todayKey();
  
  const entry: WeightEntry = {
    id: Date.now().toString(),
    date: entryDate,
    weight,
    timestamp: Date.now(),
    notes,
  };
  
  // Append new entry to the logs array (do not update/overwrite past entries)
  history.push(entry);
  
  // Sort by timestamp so the latest entry is always last
  history.sort((a, b) => a.timestamp - b.timestamp);
  write(WEIGHT_KEY, history);

  // Initialize immutable origin_weight if it is the first entry
  const progress = getProgress();
  if (progress.originWeight === null) {
    progress.originWeight = weight;
    progress.startDate = entryDate;
    saveProgress(progress);
  }

  return entry;
}

export function getStartingWeight(): number | null {
  return getProgress().originWeight;
}

export function getCurrentWeight(): number | null {
  const history = getWeightHistory();
  return history.length > 0 ? history[history.length - 1].weight : null;
}

/** Total Progress: Compares most recent log entry against the immutable origin_weight */
export function getWeightProgress(): number | null {
  const current = getCurrentWeight();
  const origin = getStartingWeight();
  if (current === null || origin === null) return null;
  return current - origin;
}

/** Time Elapsed: Compares latest timestamp against the start_date */
export function getWeightTimeElapsed(): string {
  const progress = getProgress();
  if (!progress.startDate) return "0 days";

  const start = new Date(progress.startDate);
  const history = getWeightHistory();
  const latestTimestamp = history.length > 0 ? history[history.length - 1].timestamp : Date.now();
  
  const diffTime = Math.abs(latestTimestamp - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return `${diffDays} days`;
}

// ============================================
// Export / Import
// ============================================

export function exportAllData(): string {
  return JSON.stringify({
    foods: getPersonalFoods(),
    logs: getAllLogs(),
    settings: getSettings(),
    progress: getProgress(),
    weightHistory: getWeightHistory(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.foods) write(FOODS_KEY, data.foods);
    if (data.logs) write(LOGS_KEY, data.logs);
    if (data.settings) write(SETTINGS_KEY, data.settings);
    if (data.progress) write(PROGRESS_KEY, data.progress);
    if (data.weightHistory) write(WEIGHT_KEY, data.weightHistory);
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FOODS_KEY);
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(WEIGHT_KEY);
}
