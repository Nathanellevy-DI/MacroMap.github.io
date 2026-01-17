// Common whole foods database with nutrition per 100g
// Users can specify weight in kg or lbs

export interface WholeFood {
    name: string;
    category: string;
    emoji: string;
    per100g: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
    commonServings: {
        name: string;
        grams: number;
    }[];
}

export const WHOLE_FOODS: WholeFood[] = [
    // Meats
    {
        name: "Beef Steak (Ribeye)",
        category: "Meat",
        emoji: "🥩",
        per100g: { calories: 291, protein: 24, carbs: 0, fat: 21 },
        commonServings: [
            { name: "Small (6oz)", grams: 170 },
            { name: "Medium (8oz)", grams: 227 },
            { name: "Large (12oz)", grams: 340 },
        ],
    },
    {
        name: "Beef Steak (Sirloin)",
        category: "Meat",
        emoji: "🥩",
        per100g: { calories: 183, protein: 27, carbs: 0, fat: 8 },
        commonServings: [
            { name: "Small (6oz)", grams: 170 },
            { name: "Medium (8oz)", grams: 227 },
            { name: "Large (12oz)", grams: 340 },
        ],
    },
    {
        name: "Chicken Breast",
        category: "Meat",
        emoji: "🍗",
        per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        commonServings: [
            { name: "Small breast", grams: 115 },
            { name: "Medium breast", grams: 170 },
            { name: "Large breast", grams: 225 },
        ],
    },
    {
        name: "Chicken Thigh",
        category: "Meat",
        emoji: "🍗",
        per100g: { calories: 209, protein: 26, carbs: 0, fat: 10.9 },
        commonServings: [
            { name: "1 thigh", grams: 110 },
            { name: "2 thighs", grams: 220 },
        ],
    },
    {
        name: "Ground Beef (80/20)",
        category: "Meat",
        emoji: "🥩",
        per100g: { calories: 254, protein: 17, carbs: 0, fat: 20 },
        commonServings: [
            { name: "Quarter pounder", grams: 113 },
            { name: "Half pound", grams: 227 },
        ],
    },
    {
        name: "Ground Turkey",
        category: "Meat",
        emoji: "🦃",
        per100g: { calories: 149, protein: 20, carbs: 0, fat: 7 },
        commonServings: [
            { name: "1/4 lb patty", grams: 113 },
            { name: "1/2 lb", grams: 227 },
        ],
    },
    {
        name: "Pork Chop",
        category: "Meat",
        emoji: "🥩",
        per100g: { calories: 231, protein: 25, carbs: 0, fat: 14 },
        commonServings: [
            { name: "Medium chop", grams: 150 },
            { name: "Large chop", grams: 200 },
        ],
    },
    {
        name: "Bacon",
        category: "Meat",
        emoji: "🥓",
        per100g: { calories: 541, protein: 37, carbs: 1.4, fat: 42 },
        commonServings: [
            { name: "2 slices", grams: 16 },
            { name: "4 slices", grams: 32 },
        ],
    },
    {
        name: "Salmon",
        category: "Fish",
        emoji: "🐟",
        per100g: { calories: 208, protein: 20, carbs: 0, fat: 13 },
        commonServings: [
            { name: "Small fillet", grams: 100 },
            { name: "Medium fillet", grams: 170 },
            { name: "Large fillet", grams: 225 },
        ],
    },
    {
        name: "Tuna (canned)",
        category: "Fish",
        emoji: "🐟",
        per100g: { calories: 116, protein: 26, carbs: 0, fat: 1 },
        commonServings: [
            { name: "1 can (drained)", grams: 112 },
        ],
    },
    {
        name: "Shrimp",
        category: "Seafood",
        emoji: "🦐",
        per100g: { calories: 99, protein: 24, carbs: 0, fat: 0.3 },
        commonServings: [
            { name: "6 large shrimp", grams: 84 },
            { name: "10 medium shrimp", grams: 100 },
        ],
    },
    // Eggs & Dairy
    {
        name: "Egg (whole)",
        category: "Eggs & Dairy",
        emoji: "🥚",
        per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
        commonServings: [
            { name: "1 large egg", grams: 50 },
            { name: "2 large eggs", grams: 100 },
            { name: "3 large eggs", grams: 150 },
        ],
    },
    {
        name: "Greek Yogurt",
        category: "Eggs & Dairy",
        emoji: "🥛",
        per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.7 },
        commonServings: [
            { name: "1 cup", grams: 245 },
            { name: "1/2 cup", grams: 122 },
        ],
    },
    {
        name: "Cheese (Cheddar)",
        category: "Eggs & Dairy",
        emoji: "🧀",
        per100g: { calories: 403, protein: 25, carbs: 1.3, fat: 33 },
        commonServings: [
            { name: "1 slice", grams: 28 },
            { name: "1 oz", grams: 28 },
        ],
    },
    // Vegetables
    {
        name: "Broccoli",
        category: "Vegetables",
        emoji: "🥦",
        per100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
        commonServings: [
            { name: "1 cup chopped", grams: 91 },
            { name: "1 medium stalk", grams: 148 },
        ],
    },
    {
        name: "Spinach",
        category: "Vegetables",
        emoji: "🥬",
        per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
        commonServings: [
            { name: "1 cup raw", grams: 30 },
            { name: "1 cup cooked", grams: 180 },
        ],
    },
    {
        name: "Sweet Potato",
        category: "Vegetables",
        emoji: "🍠",
        per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
        commonServings: [
            { name: "Medium potato", grams: 114 },
            { name: "Large potato", grams: 180 },
        ],
    },
    {
        name: "Potato (white)",
        category: "Vegetables",
        emoji: "🥔",
        per100g: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
        commonServings: [
            { name: "Medium potato", grams: 150 },
            { name: "Large potato", grams: 300 },
        ],
    },
    {
        name: "Avocado",
        category: "Vegetables",
        emoji: "🥑",
        per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 7 },
        commonServings: [
            { name: "1/2 avocado", grams: 100 },
            { name: "1 whole avocado", grams: 200 },
        ],
    },
    {
        name: "Tomato",
        category: "Vegetables",
        emoji: "🍅",
        per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
        commonServings: [
            { name: "1 medium tomato", grams: 123 },
            { name: "1 cup cherry tomatoes", grams: 149 },
        ],
    },
    // Fruits
    {
        name: "Banana",
        category: "Fruits",
        emoji: "🍌",
        per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
        commonServings: [
            { name: "Medium banana", grams: 118 },
            { name: "Large banana", grams: 136 },
        ],
    },
    {
        name: "Apple",
        category: "Fruits",
        emoji: "🍎",
        per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
        commonServings: [
            { name: "Medium apple", grams: 182 },
            { name: "Large apple", grams: 223 },
        ],
    },
    {
        name: "Orange",
        category: "Fruits",
        emoji: "🍊",
        per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
        commonServings: [
            { name: "Medium orange", grams: 131 },
        ],
    },
    {
        name: "Strawberries",
        category: "Fruits",
        emoji: "🍓",
        per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
        commonServings: [
            { name: "1 cup", grams: 152 },
            { name: "8 medium berries", grams: 100 },
        ],
    },
    {
        name: "Blueberries",
        category: "Fruits",
        emoji: "🫐",
        per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
        commonServings: [
            { name: "1 cup", grams: 148 },
        ],
    },
    // Grains & Carbs
    {
        name: "White Rice (cooked)",
        category: "Grains",
        emoji: "🍚",
        per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
        commonServings: [
            { name: "1/2 cup", grams: 93 },
            { name: "1 cup", grams: 186 },
        ],
    },
    {
        name: "Brown Rice (cooked)",
        category: "Grains",
        emoji: "🍚",
        per100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
        commonServings: [
            { name: "1/2 cup", grams: 98 },
            { name: "1 cup", grams: 195 },
        ],
    },
    {
        name: "Pasta (cooked)",
        category: "Grains",
        emoji: "🍝",
        per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
        commonServings: [
            { name: "1 cup", grams: 140 },
            { name: "2 cups", grams: 280 },
        ],
    },
    {
        name: "Bread (white)",
        category: "Grains",
        emoji: "🍞",
        per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
        commonServings: [
            { name: "1 slice", grams: 30 },
            { name: "2 slices", grams: 60 },
        ],
    },
    {
        name: "Oatmeal (cooked)",
        category: "Grains",
        emoji: "🥣",
        per100g: { calories: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7 },
        commonServings: [
            { name: "1 cup", grams: 234 },
            { name: "1/2 cup", grams: 117 },
        ],
    },
    // Oils & Fats
    {
        name: "Olive Oil",
        category: "Oils",
        emoji: "🫒",
        per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 },
        commonServings: [
            { name: "1 tbsp", grams: 14 },
            { name: "1 tsp", grams: 5 },
        ],
    },
    {
        name: "Butter",
        category: "Oils",
        emoji: "🧈",
        per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
        commonServings: [
            { name: "1 tbsp", grams: 14 },
            { name: "1 pat", grams: 5 },
        ],
    },
    {
        name: "Peanut Butter",
        category: "Oils",
        emoji: "🥜",
        per100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
        commonServings: [
            { name: "1 tbsp", grams: 16 },
            { name: "2 tbsp", grams: 32 },
        ],
    },
    // Nuts
    {
        name: "Almonds",
        category: "Nuts",
        emoji: "🌰",
        per100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 },
        commonServings: [
            { name: "1/4 cup", grams: 36 },
            { name: "1 oz (23 almonds)", grams: 28 },
        ],
    },
    {
        name: "Walnuts",
        category: "Nuts",
        emoji: "🌰",
        per100g: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7 },
        commonServings: [
            { name: "1/4 cup", grams: 30 },
            { name: "1 oz", grams: 28 },
        ],
    },
];

export function searchWholeFoods(query: string): WholeFood[] {
    const normalizedQuery = query.toLowerCase().trim();

    return WHOLE_FOODS.filter(
        (food) =>
            food.name.toLowerCase().includes(normalizedQuery) ||
            food.category.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10);
}

export function calculateNutrition(food: WholeFood, gramsOrServing: number | string): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
} {
    let grams: number;

    if (typeof gramsOrServing === "number") {
        grams = gramsOrServing;
    } else {
        const serving = food.commonServings.find((s) => s.name === gramsOrServing);
        grams = serving?.grams || 100;
    }

    const multiplier = grams / 100;

    return {
        calories: Math.round(food.per100g.calories * multiplier),
        protein: Math.round(food.per100g.protein * multiplier * 10) / 10,
        carbs: Math.round(food.per100g.carbs * multiplier * 10) / 10,
        fat: Math.round(food.per100g.fat * multiplier * 10) / 10,
        fiber: food.per100g.fiber ? Math.round(food.per100g.fiber * multiplier * 10) / 10 : undefined,
    };
}

// Convert between units
export function lbsToGrams(lbs: number): number {
    return Math.round(lbs * 453.592);
}

export function kgToGrams(kg: number): number {
    return Math.round(kg * 1000);
}

export function ozToGrams(oz: number): number {
    return Math.round(oz * 28.3495);
}
