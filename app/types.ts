/* ============================================
   MacroMap — Type Definitions
   ============================================ */

/** Whether an item is food or drink */
export type FoodType = 'food' | 'drink';

/** Full nutrient profile — all fields optional except core macros */
export interface NutrientProfile {
  // ── Core Macros (required) ──
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // ── Extended Macros (optional) ──
  fiber?: number;
  sugar?: number;
  water?: number; // grams of water content

  // ── Essential Minerals (mg, optional) ──
  sodium?: number;
  potassium?: number;
  magnesium?: number;
  calcium?: number;
  iron?: number;
  zinc?: number;

  // ── Essential Vitamins (optional) ──
  /** Vitamin A in mcg RAE */
  vitaminA?: number;
  /** B1 Thiamine in mg */
  vitaminB1?: number;
  /** B2 Riboflavin in mg */
  vitaminB2?: number;
  /** B3 Niacin in mg */
  vitaminB3?: number;
  /** B5 Pantothenic Acid in mg */
  vitaminB5?: number;
  /** B6 Pyridoxine in mg */
  vitaminB6?: number;
  /** B7 Biotin in mcg */
  vitaminB7?: number;
  /** B9 Folate in mcg */
  vitaminB9?: number;
  /** B12 Cobalamin in mcg */
  vitaminB12?: number;
  /** Vitamin C in mg */
  vitaminC?: number;
  /** Vitamin D in mcg */
  vitaminD?: number;
  /** Vitamin E in mg */
  vitaminE?: number;
  /** Vitamin K in mcg */
  vitaminK?: number;
}

/** A food saved in the user's personal library */
export interface PersonalFood extends NutrientProfile {
  id: string;
  name: string;
  emoji?: string;
  brand?: string;
  /** Whether this is a food or drink */
  type: FoodType;
  /** Description of one serving, e.g. "100g", "1 piece", "1 scoop" */
  servingSize: string;
  /** Gram equivalent of one serving (for weight-based math). Null if unit-based. */
  servingGrams?: number;
  createdAt: number;
  lastUsed?: number;
  timesUsed: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** A single food entry logged on a specific day */
export interface LogEntry extends NutrientProfile {
  id: string;
  /** Links back to PersonalFood if it came from the library */
  foodId?: string;
  name: string;
  mealType: MealType;
  /** Whether this is a food or drink */
  type?: FoodType;
  /** How much was consumed */
  quantity: number;
  quantityUnit: string;
  timestamp: number;
}

/** All data for a single day, keyed by YYYY-MM-DD */
export interface DayLog {
  entries: LogEntry[];
  water: number;
}

/** A single weight log entry */
export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
  timestamp: number;
}

/** User profile and goals */
export interface UserSettings {
  name: string;
  profilePicture?: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
  waterUnit: 'glasses' | 'oz' | 'ml';
  weightUnit: 'lbs' | 'kg';
  darkMode: boolean;
}

/** Gamification / Progress */
export interface UserProgress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalMealsLogged: number;
  totalDaysLogged: number;
  lastLogDate: string | null; // YYYY-MM-DD
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (progress: UserProgress) => boolean;
}

/** Macro totals helper */
export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Nutrient metadata for rendering forms */
export interface NutrientField {
  key: keyof NutrientProfile;
  label: string;
  unit: string;
  group: 'macro' | 'mineral' | 'vitamin';
  color?: string;
}

/** All trackable nutrient fields with metadata */
export const NUTRIENT_FIELDS: NutrientField[] = [
  // Macros
  { key: 'calories', label: 'Calories', unit: 'kcal', group: 'macro' },
  { key: 'protein', label: 'Protein', unit: 'g', group: 'macro', color: 'var(--protein)' },
  { key: 'carbs', label: 'Carbs', unit: 'g', group: 'macro', color: 'var(--carbs)' },
  { key: 'fat', label: 'Fat', unit: 'g', group: 'macro', color: 'var(--fat)' },
  { key: 'fiber', label: 'Fiber', unit: 'g', group: 'macro' },
  { key: 'sugar', label: 'Sugar', unit: 'g', group: 'macro' },
  { key: 'water', label: 'Water Content', unit: 'g', group: 'macro' },

  // Minerals
  { key: 'sodium', label: 'Sodium', unit: 'mg', group: 'mineral' },
  { key: 'potassium', label: 'Potassium', unit: 'mg', group: 'mineral' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg', group: 'mineral' },
  { key: 'calcium', label: 'Calcium', unit: 'mg', group: 'mineral' },
  { key: 'iron', label: 'Iron', unit: 'mg', group: 'mineral' },
  { key: 'zinc', label: 'Zinc', unit: 'mg', group: 'mineral' },

  // Vitamins
  { key: 'vitaminA', label: 'Vitamin A', unit: 'mcg', group: 'vitamin' },
  { key: 'vitaminB1', label: 'B1 (Thiamine)', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminB2', label: 'B2 (Riboflavin)', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminB3', label: 'B3 (Niacin)', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminB5', label: 'B5 (Pantothenic)', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminB6', label: 'B6 (Pyridoxine)', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminB7', label: 'B7 (Biotin)', unit: 'mcg', group: 'vitamin' },
  { key: 'vitaminB9', label: 'B9 (Folate)', unit: 'mcg', group: 'vitamin' },
  { key: 'vitaminB12', label: 'B12 (Cobalamin)', unit: 'mcg', group: 'vitamin' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg', group: 'vitamin' },
  { key: 'vitaminE', label: 'Vitamin E', unit: 'mg', group: 'vitamin' },
  { key: 'vitaminK', label: 'Vitamin K', unit: 'mcg', group: 'vitamin' },
];
