// Expanded Whole Foods Database
// 80+ items with nutrition per 100g

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
    commonServings: { name: string; grams: number }[];
}

export const WHOLE_FOODS: WholeFood[] = [
    // === MEATS ===
    { name: "Beef Steak (Ribeye)", category: "Meat", emoji: "🥩", per100g: { calories: 291, protein: 24, carbs: 0, fat: 21 }, commonServings: [{ name: "6oz", grams: 170 }, { name: "8oz", grams: 227 }, { name: "12oz", grams: 340 }] },
    { name: "Beef Steak (Sirloin)", category: "Meat", emoji: "🥩", per100g: { calories: 183, protein: 27, carbs: 0, fat: 8 }, commonServings: [{ name: "6oz", grams: 170 }, { name: "8oz", grams: 227 }] },
    { name: "Beef Steak (Filet Mignon)", category: "Meat", emoji: "🥩", per100g: { calories: 267, protein: 26, carbs: 0, fat: 17 }, commonServings: [{ name: "6oz", grams: 170 }, { name: "8oz", grams: 227 }] },
    { name: "Beef Steak (NY Strip)", category: "Meat", emoji: "🥩", per100g: { calories: 224, protein: 26, carbs: 0, fat: 13 }, commonServings: [{ name: "8oz", grams: 227 }, { name: "12oz", grams: 340 }] },
    { name: "Ground Beef (80/20)", category: "Meat", emoji: "🥩", per100g: { calories: 254, protein: 17, carbs: 0, fat: 20 }, commonServings: [{ name: "4oz patty", grams: 113 }, { name: "1/2 lb", grams: 227 }] },
    { name: "Ground Beef (90/10)", category: "Meat", emoji: "🥩", per100g: { calories: 176, protein: 20, carbs: 0, fat: 10 }, commonServings: [{ name: "4oz patty", grams: 113 }, { name: "1/2 lb", grams: 227 }] },
    { name: "Ground Beef (93/7)", category: "Meat", emoji: "🥩", per100g: { calories: 152, protein: 21, carbs: 0, fat: 7 }, commonServings: [{ name: "4oz patty", grams: 113 }] },
    { name: "Chicken Breast", category: "Meat", emoji: "🍗", per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, commonServings: [{ name: "Small", grams: 115 }, { name: "Medium", grams: 170 }, { name: "Large", grams: 225 }] },
    { name: "Chicken Thigh", category: "Meat", emoji: "🍗", per100g: { calories: 209, protein: 26, carbs: 0, fat: 10.9 }, commonServings: [{ name: "1 thigh", grams: 110 }, { name: "2 thighs", grams: 220 }] },
    { name: "Chicken Wing", category: "Meat", emoji: "🍗", per100g: { calories: 203, protein: 30, carbs: 0, fat: 8 }, commonServings: [{ name: "1 wing", grams: 34 }, { name: "6 wings", grams: 204 }] },
    { name: "Chicken Drumstick", category: "Meat", emoji: "🍗", per100g: { calories: 172, protein: 28, carbs: 0, fat: 6 }, commonServings: [{ name: "1 drumstick", grams: 72 }, { name: "2 drumsticks", grams: 144 }] },
    { name: "Ground Turkey", category: "Meat", emoji: "🦃", per100g: { calories: 149, protein: 20, carbs: 0, fat: 7 }, commonServings: [{ name: "4oz", grams: 113 }, { name: "1/2 lb", grams: 227 }] },
    { name: "Turkey Breast", category: "Meat", emoji: "🦃", per100g: { calories: 135, protein: 30, carbs: 0, fat: 1 }, commonServings: [{ name: "4oz", grams: 113 }, { name: "6oz", grams: 170 }] },
    { name: "Pork Chop", category: "Meat", emoji: "🥩", per100g: { calories: 231, protein: 25, carbs: 0, fat: 14 }, commonServings: [{ name: "Medium", grams: 150 }, { name: "Large", grams: 200 }] },
    { name: "Pork Tenderloin", category: "Meat", emoji: "🥩", per100g: { calories: 143, protein: 26, carbs: 0, fat: 4 }, commonServings: [{ name: "4oz", grams: 113 }, { name: "6oz", grams: 170 }] },
    { name: "Pork Loin", category: "Meat", emoji: "🥩", per100g: { calories: 196, protein: 27, carbs: 0, fat: 9 }, commonServings: [{ name: "4oz", grams: 113 }] },
    { name: "Bacon", category: "Meat", emoji: "🥓", per100g: { calories: 541, protein: 37, carbs: 1.4, fat: 42 }, commonServings: [{ name: "2 slices", grams: 16 }, { name: "4 slices", grams: 32 }] },
    { name: "Ham", category: "Meat", emoji: "🍖", per100g: { calories: 145, protein: 21, carbs: 1, fat: 6 }, commonServings: [{ name: "2oz", grams: 56 }, { name: "4oz", grams: 113 }] },
    { name: "Lamb Chop", category: "Meat", emoji: "🥩", per100g: { calories: 282, protein: 25, carbs: 0, fat: 20 }, commonServings: [{ name: "1 chop", grams: 100 }, { name: "2 chops", grams: 200 }] },
    { name: "Ground Lamb", category: "Meat", emoji: "🥩", per100g: { calories: 283, protein: 17, carbs: 0, fat: 23 }, commonServings: [{ name: "4oz", grams: 113 }] },
    { name: "Venison", category: "Meat", emoji: "🦌", per100g: { calories: 158, protein: 30, carbs: 0, fat: 3 }, commonServings: [{ name: "4oz", grams: 113 }] },
    { name: "Bison", category: "Meat", emoji: "🦬", per100g: { calories: 143, protein: 28, carbs: 0, fat: 2 }, commonServings: [{ name: "4oz patty", grams: 113 }] },

    // === SEAFOOD ===
    { name: "Salmon", category: "Seafood", emoji: "🐟", per100g: { calories: 208, protein: 20, carbs: 0, fat: 13 }, commonServings: [{ name: "Small fillet", grams: 100 }, { name: "Medium fillet", grams: 170 }, { name: "Large fillet", grams: 225 }] },
    { name: "Tuna (fresh)", category: "Seafood", emoji: "🐟", per100g: { calories: 132, protein: 28, carbs: 0, fat: 1 }, commonServings: [{ name: "Steak", grams: 150 }] },
    { name: "Tuna (canned)", category: "Seafood", emoji: "🐟", per100g: { calories: 116, protein: 26, carbs: 0, fat: 1 }, commonServings: [{ name: "1 can", grams: 112 }] },
    { name: "Shrimp", category: "Seafood", emoji: "🦐", per100g: { calories: 99, protein: 24, carbs: 0, fat: 0.3 }, commonServings: [{ name: "6 large", grams: 84 }, { name: "10 medium", grams: 100 }] },
    { name: "Cod", category: "Seafood", emoji: "🐟", per100g: { calories: 82, protein: 18, carbs: 0, fat: 0.7 }, commonServings: [{ name: "Fillet", grams: 150 }] },
    { name: "Tilapia", category: "Seafood", emoji: "🐟", per100g: { calories: 96, protein: 20, carbs: 0, fat: 2 }, commonServings: [{ name: "Fillet", grams: 130 }] },
    { name: "Halibut", category: "Seafood", emoji: "🐟", per100g: { calories: 111, protein: 23, carbs: 0, fat: 2 }, commonServings: [{ name: "Fillet", grams: 160 }] },
    { name: "Mahi Mahi", category: "Seafood", emoji: "🐟", per100g: { calories: 85, protein: 18, carbs: 0, fat: 0.7 }, commonServings: [{ name: "Fillet", grams: 150 }] },
    { name: "Crab", category: "Seafood", emoji: "🦀", per100g: { calories: 97, protein: 19, carbs: 0, fat: 2 }, commonServings: [{ name: "1 cup", grams: 135 }] },
    { name: "Lobster", category: "Seafood", emoji: "🦞", per100g: { calories: 89, protein: 19, carbs: 0.5, fat: 0.9 }, commonServings: [{ name: "1 tail", grams: 145 }] },
    { name: "Scallops", category: "Seafood", emoji: "🐚", per100g: { calories: 69, protein: 12, carbs: 3, fat: 0.5 }, commonServings: [{ name: "5 large", grams: 75 }] },

    // === EGGS & DAIRY ===
    { name: "Egg (whole)", category: "Eggs & Dairy", emoji: "🥚", per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 }, commonServings: [{ name: "1 large", grams: 50 }, { name: "2 large", grams: 100 }, { name: "3 large", grams: 150 }] },
    { name: "Egg Whites", category: "Eggs & Dairy", emoji: "🥚", per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 }, commonServings: [{ name: "2 egg whites", grams: 66 }, { name: "1 cup", grams: 243 }] },
    { name: "Greek Yogurt (0%)", category: "Eggs & Dairy", emoji: "🥛", per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.7 }, commonServings: [{ name: "1 cup", grams: 245 }, { name: "1/2 cup", grams: 122 }] },
    { name: "Greek Yogurt (2%)", category: "Eggs & Dairy", emoji: "🥛", per100g: { calories: 73, protein: 9, carbs: 4, fat: 2 }, commonServings: [{ name: "1 cup", grams: 245 }] },
    { name: "Cottage Cheese (1%)", category: "Eggs & Dairy", emoji: "🧀", per100g: { calories: 72, protein: 12, carbs: 2.7, fat: 1 }, commonServings: [{ name: "1 cup", grams: 226 }, { name: "1/2 cup", grams: 113 }] },
    { name: "Cheese (Cheddar)", category: "Eggs & Dairy", emoji: "🧀", per100g: { calories: 403, protein: 25, carbs: 1.3, fat: 33 }, commonServings: [{ name: "1 slice", grams: 28 }, { name: "1 oz", grams: 28 }] },
    { name: "Cheese (Mozzarella)", category: "Eggs & Dairy", emoji: "🧀", per100g: { calories: 280, protein: 28, carbs: 3, fat: 17 }, commonServings: [{ name: "1 oz", grams: 28 }] },
    { name: "Cheese (Parmesan)", category: "Eggs & Dairy", emoji: "🧀", per100g: { calories: 431, protein: 38, carbs: 4, fat: 29 }, commonServings: [{ name: "1 tbsp", grams: 10 }] },
    { name: "Milk (Whole)", category: "Eggs & Dairy", emoji: "🥛", per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 }, commonServings: [{ name: "1 cup", grams: 244 }] },
    { name: "Milk (2%)", category: "Eggs & Dairy", emoji: "🥛", per100g: { calories: 50, protein: 3.3, carbs: 4.8, fat: 2 }, commonServings: [{ name: "1 cup", grams: 244 }] },
    { name: "Milk (Skim)", category: "Eggs & Dairy", emoji: "🥛", per100g: { calories: 34, protein: 3.4, carbs: 5, fat: 0.1 }, commonServings: [{ name: "1 cup", grams: 245 }] },

    // === VEGETABLES ===
    { name: "Broccoli", category: "Vegetables", emoji: "🥦", per100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 }, commonServings: [{ name: "1 cup", grams: 91 }, { name: "1 stalk", grams: 148 }] },
    { name: "Spinach", category: "Vegetables", emoji: "🥬", per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }, commonServings: [{ name: "1 cup raw", grams: 30 }, { name: "1 cup cooked", grams: 180 }] },
    { name: "Kale", category: "Vegetables", emoji: "🥬", per100g: { calories: 49, protein: 4.3, carbs: 9, fat: 0.9, fiber: 3.6 }, commonServings: [{ name: "1 cup raw", grams: 67 }] },
    { name: "Asparagus", category: "Vegetables", emoji: "🌾", per100g: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1 }, commonServings: [{ name: "6 spears", grams: 90 }] },
    { name: "Green Beans", category: "Vegetables", emoji: "🫛", per100g: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 2.7 }, commonServings: [{ name: "1 cup", grams: 125 }] },
    { name: "Sweet Potato", category: "Vegetables", emoji: "🍠", per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 }, commonServings: [{ name: "Medium", grams: 114 }, { name: "Large", grams: 180 }] },
    { name: "Potato (White)", category: "Vegetables", emoji: "🥔", per100g: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 }, commonServings: [{ name: "Medium", grams: 150 }, { name: "Large", grams: 300 }] },
    { name: "Russet Potato", category: "Vegetables", emoji: "🥔", per100g: { calories: 79, protein: 2.1, carbs: 18, fat: 0.1, fiber: 1.3 }, commonServings: [{ name: "Medium", grams: 170 }] },
    { name: "Carrots", category: "Vegetables", emoji: "🥕", per100g: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 }, commonServings: [{ name: "1 medium", grams: 61 }, { name: "1 cup chopped", grams: 128 }] },
    { name: "Bell Pepper", category: "Vegetables", emoji: "🫑", per100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 }, commonServings: [{ name: "1 medium", grams: 119 }] },
    { name: "Onion", category: "Vegetables", emoji: "🧅", per100g: { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7 }, commonServings: [{ name: "1 medium", grams: 110 }] },
    { name: "Tomato", category: "Vegetables", emoji: "🍅", per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }, commonServings: [{ name: "1 medium", grams: 123 }, { name: "1 cup cherry", grams: 149 }] },
    { name: "Avocado", category: "Vegetables", emoji: "🥑", per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 7 }, commonServings: [{ name: "1/2 avocado", grams: 100 }, { name: "1 whole", grams: 200 }] },
    { name: "Cucumber", category: "Vegetables", emoji: "🥒", per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 }, commonServings: [{ name: "1 cup", grams: 104 }] },
    { name: "Zucchini", category: "Vegetables", emoji: "🥒", per100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 }, commonServings: [{ name: "1 medium", grams: 196 }] },
    { name: "Cauliflower", category: "Vegetables", emoji: "🥦", per100g: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 }, commonServings: [{ name: "1 cup", grams: 107 }] },
    { name: "Brussels Sprouts", category: "Vegetables", emoji: "🥬", per100g: { calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8 }, commonServings: [{ name: "1 cup", grams: 88 }] },
    { name: "Mushrooms", category: "Vegetables", emoji: "🍄", per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 }, commonServings: [{ name: "1 cup sliced", grams: 70 }] },

    // === FRUITS ===
    { name: "Banana", category: "Fruits", emoji: "🍌", per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 }, commonServings: [{ name: "Medium", grams: 118 }, { name: "Large", grams: 136 }] },
    { name: "Apple", category: "Fruits", emoji: "🍎", per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }, commonServings: [{ name: "Medium", grams: 182 }, { name: "Large", grams: 223 }] },
    { name: "Orange", category: "Fruits", emoji: "🍊", per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 }, commonServings: [{ name: "Medium", grams: 131 }] },
    { name: "Strawberries", category: "Fruits", emoji: "🍓", per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 }, commonServings: [{ name: "1 cup", grams: 152 }] },
    { name: "Blueberries", category: "Fruits", emoji: "🫐", per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 }, commonServings: [{ name: "1 cup", grams: 148 }] },
    { name: "Raspberries", category: "Fruits", emoji: "🍇", per100g: { calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5 }, commonServings: [{ name: "1 cup", grams: 123 }] },
    { name: "Grapes", category: "Fruits", emoji: "🍇", per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 }, commonServings: [{ name: "1 cup", grams: 151 }] },
    { name: "Watermelon", category: "Fruits", emoji: "🍉", per100g: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4 }, commonServings: [{ name: "1 cup", grams: 152 }, { name: "1 wedge", grams: 286 }] },
    { name: "Mango", category: "Fruits", emoji: "🥭", per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 }, commonServings: [{ name: "1 cup", grams: 165 }] },
    { name: "Pineapple", category: "Fruits", emoji: "🍍", per100g: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 }, commonServings: [{ name: "1 cup", grams: 165 }] },
    { name: "Peach", category: "Fruits", emoji: "🍑", per100g: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5 }, commonServings: [{ name: "1 medium", grams: 150 }] },

    // === GRAINS ===
    { name: "White Rice (cooked)", category: "Grains", emoji: "🍚", per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 }, commonServings: [{ name: "1/2 cup", grams: 93 }, { name: "1 cup", grams: 186 }] },
    { name: "Brown Rice (cooked)", category: "Grains", emoji: "🍚", per100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 }, commonServings: [{ name: "1/2 cup", grams: 98 }, { name: "1 cup", grams: 195 }] },
    { name: "Quinoa (cooked)", category: "Grains", emoji: "🌾", per100g: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 }, commonServings: [{ name: "1 cup", grams: 185 }] },
    { name: "Pasta (cooked)", category: "Grains", emoji: "🍝", per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1 }, commonServings: [{ name: "1 cup", grams: 140 }, { name: "2 cups", grams: 280 }] },
    { name: "Whole Wheat Pasta (cooked)", category: "Grains", emoji: "🍝", per100g: { calories: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 4.5 }, commonServings: [{ name: "1 cup", grams: 140 }] },
    { name: "Bread (White)", category: "Grains", emoji: "🍞", per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2 }, commonServings: [{ name: "1 slice", grams: 30 }, { name: "2 slices", grams: 60 }] },
    { name: "Bread (Whole Wheat)", category: "Grains", emoji: "🍞", per100g: { calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7 }, commonServings: [{ name: "1 slice", grams: 30 }] },
    { name: "Oatmeal (cooked)", category: "Grains", emoji: "🥣", per100g: { calories: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7 }, commonServings: [{ name: "1 cup", grams: 234 }] },
    { name: "Oats (dry)", category: "Grains", emoji: "🥣", per100g: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10 }, commonServings: [{ name: "1/2 cup", grams: 40 }] },

    // === LEGUMES ===
    { name: "Black Beans (cooked)", category: "Legumes", emoji: "🫘", per100g: { calories: 132, protein: 9, carbs: 24, fat: 0.5, fiber: 8 }, commonServings: [{ name: "1/2 cup", grams: 86 }, { name: "1 cup", grams: 172 }] },
    { name: "Chickpeas (cooked)", category: "Legumes", emoji: "🫘", per100g: { calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8 }, commonServings: [{ name: "1/2 cup", grams: 82 }] },
    { name: "Lentils (cooked)", category: "Legumes", emoji: "🫘", per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 }, commonServings: [{ name: "1 cup", grams: 198 }] },
    { name: "Kidney Beans (cooked)", category: "Legumes", emoji: "🫘", per100g: { calories: 127, protein: 9, carbs: 23, fat: 0.5, fiber: 6 }, commonServings: [{ name: "1/2 cup", grams: 89 }] },
    { name: "Edamame", category: "Legumes", emoji: "🫛", per100g: { calories: 121, protein: 12, carbs: 9, fat: 5, fiber: 5 }, commonServings: [{ name: "1 cup", grams: 155 }] },
    { name: "Tofu (firm)", category: "Legumes", emoji: "🧊", per100g: { calories: 144, protein: 17, carbs: 3, fat: 8 }, commonServings: [{ name: "1/2 block", grams: 126 }] },

    // === NUTS & SEEDS ===
    { name: "Almonds", category: "Nuts", emoji: "🌰", per100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 }, commonServings: [{ name: "1/4 cup", grams: 36 }, { name: "1 oz", grams: 28 }] },
    { name: "Walnuts", category: "Nuts", emoji: "🌰", per100g: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7 }, commonServings: [{ name: "1/4 cup", grams: 30 }, { name: "1 oz", grams: 28 }] },
    { name: "Cashews", category: "Nuts", emoji: "🌰", per100g: { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3 }, commonServings: [{ name: "1/4 cup", grams: 32 }] },
    { name: "Peanuts", category: "Nuts", emoji: "🥜", per100g: { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 9 }, commonServings: [{ name: "1/4 cup", grams: 36 }] },
    { name: "Peanut Butter", category: "Nuts", emoji: "🥜", per100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 }, commonServings: [{ name: "1 tbsp", grams: 16 }, { name: "2 tbsp", grams: 32 }] },
    { name: "Almond Butter", category: "Nuts", emoji: "🌰", per100g: { calories: 614, protein: 21, carbs: 19, fat: 56, fiber: 10 }, commonServings: [{ name: "1 tbsp", grams: 16 }, { name: "2 tbsp", grams: 32 }] },
    { name: "Chia Seeds", category: "Seeds", emoji: "🌱", per100g: { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 }, commonServings: [{ name: "1 tbsp", grams: 12 }] },
    { name: "Flax Seeds", category: "Seeds", emoji: "🌱", per100g: { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 }, commonServings: [{ name: "1 tbsp", grams: 10 }] },
    { name: "Sunflower Seeds", category: "Seeds", emoji: "🌻", per100g: { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 9 }, commonServings: [{ name: "1/4 cup", grams: 32 }] },

    // === OILS ===
    { name: "Olive Oil", category: "Oils", emoji: "🫒", per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 }, commonServings: [{ name: "1 tbsp", grams: 14 }, { name: "1 tsp", grams: 5 }] },
    { name: "Coconut Oil", category: "Oils", emoji: "🥥", per100g: { calories: 862, protein: 0, carbs: 0, fat: 100 }, commonServings: [{ name: "1 tbsp", grams: 14 }] },
    { name: "Butter", category: "Oils", emoji: "🧈", per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 }, commonServings: [{ name: "1 tbsp", grams: 14 }, { name: "1 pat", grams: 5 }] },
];

export function searchWholeFoods(query: string): WholeFood[] {
    const normalizedQuery = query.toLowerCase().trim();
    return WHOLE_FOODS.filter(
        (food) =>
            food.name.toLowerCase().includes(normalizedQuery) ||
            food.category.toLowerCase().includes(normalizedQuery)
    ).slice(0, 15);
}

export function calculateNutrition(food: WholeFood, gramsOrServing: number | string) {
    let grams: number;
    if (typeof gramsOrServing === "number") {
        grams = gramsOrServing;
    } else {
        const serving = food.commonServings.find((s) => s.name === gramsOrServing);
        grams = serving?.grams || 100;
    }
    const m = grams / 100;
    return {
        calories: Math.round(food.per100g.calories * m),
        protein: Math.round(food.per100g.protein * m * 10) / 10,
        carbs: Math.round(food.per100g.carbs * m * 10) / 10,
        fat: Math.round(food.per100g.fat * m * 10) / 10,
        fiber: food.per100g.fiber ? Math.round(food.per100g.fiber * m * 10) / 10 : undefined,
    };
}

export function lbsToGrams(lbs: number): number { return Math.round(lbs * 453.592); }
export function kgToGrams(kg: number): number { return Math.round(kg * 1000); }
export function ozToGrams(oz: number): number { return Math.round(oz * 28.3495); }
