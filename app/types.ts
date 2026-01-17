export interface RedFlag {
    name: string;
    risk: string;
    eu_status: string;
    alias?: string;
}

export interface AnalysisResult {
    score: number;
    red_flags: RedFlag[];
    reformulation_note?: string;
    all_ingredients: string[];
}

// Meal Builder Types
export interface FoodItem {
    id: string;
    name: string;
    brand?: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    timestamp: number;
}

export interface MacroTotals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
}

export interface MealAnalysisResult {
    food_item: {
        name: string;
        brand?: string;
        serving_size: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
    };
}
