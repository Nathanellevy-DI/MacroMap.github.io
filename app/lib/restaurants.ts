// Restaurant Menu Database
// Popular fast food chains with nutrition data

export interface MenuItem {
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
}

export interface Restaurant {
    name: string;
    logo: string;
    color: string;
    items: MenuItem[];
}

export const RESTAURANTS: Restaurant[] = [
    {
        name: "McDonald's",
        logo: "🍟",
        color: "#FFC107",
        items: [
            { name: "Big Mac", category: "Burgers", calories: 550, protein: 25, carbs: 45, fat: 30 },
            { name: "Quarter Pounder with Cheese", category: "Burgers", calories: 520, protein: 30, carbs: 42, fat: 26 },
            { name: "McChicken", category: "Burgers", calories: 400, protein: 14, carbs: 40, fat: 21 },
            { name: "Filet-O-Fish", category: "Burgers", calories: 390, protein: 16, carbs: 39, fat: 19 },
            { name: "Chicken McNuggets (10pc)", category: "Chicken", calories: 420, protein: 25, carbs: 26, fat: 25 },
            { name: "Medium Fries", category: "Sides", calories: 320, protein: 5, carbs: 43, fat: 15 },
            { name: "Large Fries", category: "Sides", calories: 480, protein: 7, carbs: 64, fat: 23 },
            { name: "McFlurry Oreo", category: "Desserts", calories: 510, protein: 11, carbs: 80, fat: 17 },
            { name: "Egg McMuffin", category: "Breakfast", calories: 310, protein: 17, carbs: 30, fat: 13 },
            { name: "Sausage McMuffin with Egg", category: "Breakfast", calories: 480, protein: 21, carbs: 30, fat: 31 },
            { name: "Hash Browns", category: "Breakfast", calories: 150, protein: 1, carbs: 15, fat: 9 },
            { name: "Medium Coca-Cola", category: "Drinks", calories: 210, protein: 0, carbs: 58, fat: 0 },
        ],
    },
    {
        name: "Burger King",
        logo: "🍔",
        color: "#FF5722",
        items: [
            { name: "Whopper", category: "Burgers", calories: 657, protein: 28, carbs: 49, fat: 40 },
            { name: "Whopper with Cheese", category: "Burgers", calories: 740, protein: 32, carbs: 50, fat: 46 },
            { name: "Double Whopper", category: "Burgers", calories: 900, protein: 47, carbs: 49, fat: 56 },
            { name: "Bacon King", category: "Burgers", calories: 1150, protein: 61, carbs: 49, fat: 79 },
            { name: "Chicken Fries (9pc)", category: "Chicken", calories: 280, protein: 14, carbs: 17, fat: 17 },
            { name: "Chicken Nuggets (8pc)", category: "Chicken", calories: 310, protein: 16, carbs: 16, fat: 20 },
            { name: "Medium Fries", category: "Sides", calories: 380, protein: 5, carbs: 53, fat: 17 },
            { name: "Onion Rings (medium)", category: "Sides", calories: 410, protein: 5, carbs: 46, fat: 23 },
            { name: "Croissan'wich Sausage Egg Cheese", category: "Breakfast", calories: 520, protein: 19, carbs: 27, fat: 37 },
        ],
    },
    {
        name: "Wendy's",
        logo: "🥤",
        color: "#E53935",
        items: [
            { name: "Dave's Single", category: "Burgers", calories: 590, protein: 30, carbs: 42, fat: 34 },
            { name: "Dave's Double", category: "Burgers", calories: 850, protein: 49, carbs: 43, fat: 53 },
            { name: "Baconator", category: "Burgers", calories: 950, protein: 57, carbs: 40, fat: 62 },
            { name: "Spicy Chicken Sandwich", category: "Chicken", calories: 500, protein: 29, carbs: 49, fat: 20 },
            { name: "10pc Chicken Nuggets", category: "Chicken", calories: 450, protein: 22, carbs: 29, fat: 27 },
            { name: "Medium Fries", category: "Sides", calories: 420, protein: 5, carbs: 52, fat: 21 },
            { name: "Chili (Large)", category: "Sides", calories: 330, protein: 25, carbs: 30, fat: 12 },
            { name: "Frosty (Medium)", category: "Desserts", calories: 470, protein: 11, carbs: 76, fat: 13 },
            { name: "Breakfast Baconator", category: "Breakfast", calories: 730, protein: 35, carbs: 34, fat: 50 },
        ],
    },
    {
        name: "Subway",
        logo: "🥪",
        color: "#4CAF50",
        items: [
            { name: "6\" Italian B.M.T.", category: "Subs", calories: 410, protein: 21, carbs: 44, fat: 17 },
            { name: "6\" Turkey Breast", category: "Subs", calories: 280, protein: 18, carbs: 46, fat: 3 },
            { name: "6\" Chicken Teriyaki", category: "Subs", calories: 340, protein: 26, carbs: 47, fat: 4 },
            { name: "6\" Meatball Marinara", category: "Subs", calories: 480, protein: 22, carbs: 52, fat: 20 },
            { name: "6\" Tuna", category: "Subs", calories: 480, protein: 20, carbs: 43, fat: 25 },
            { name: "6\" Veggie Delite", category: "Subs", calories: 230, protein: 9, carbs: 44, fat: 2 },
            { name: "Footlong Italian B.M.T.", category: "Subs", calories: 820, protein: 42, carbs: 88, fat: 34 },
            { name: "Cookies (2)", category: "Desserts", calories: 400, protein: 4, carbs: 56, fat: 18 },
        ],
    },
    {
        name: "Chick-fil-A",
        logo: "🐔",
        color: "#E53935",
        items: [
            { name: "Chick-fil-A Chicken Sandwich", category: "Chicken", calories: 440, protein: 29, carbs: 40, fat: 18 },
            { name: "Spicy Chicken Sandwich", category: "Chicken", calories: 460, protein: 29, carbs: 42, fat: 19 },
            { name: "Grilled Chicken Sandwich", category: "Chicken", calories: 320, protein: 28, carbs: 36, fat: 6 },
            { name: "Chicken Nuggets (12pc)", category: "Chicken", calories: 380, protein: 40, carbs: 16, fat: 18 },
            { name: "Waffle Fries (Medium)", category: "Sides", calories: 420, protein: 5, carbs: 45, fat: 24 },
            { name: "Chicken Biscuit", category: "Breakfast", calories: 460, protein: 18, carbs: 44, fat: 23 },
            { name: "Hash Brown Scramble Bowl", category: "Breakfast", calories: 460, protein: 23, carbs: 24, fat: 30 },
            { name: "Frosted Lemonade", category: "Drinks", calories: 330, protein: 6, carbs: 64, fat: 6 },
        ],
    },
    {
        name: "Taco Bell",
        logo: "🌮",
        color: "#7B1FA2",
        items: [
            { name: "Crunchy Taco", category: "Tacos", calories: 170, protein: 8, carbs: 13, fat: 10 },
            { name: "Soft Taco", category: "Tacos", calories: 180, protein: 9, carbs: 18, fat: 9 },
            { name: "Crunchwrap Supreme", category: "Specialties", calories: 530, protein: 16, carbs: 55, fat: 21 },
            { name: "Chalupa Supreme - Beef", category: "Specialties", calories: 350, protein: 14, carbs: 30, fat: 21 },
            { name: "Quesadilla - Chicken", category: "Specialties", calories: 510, protein: 27, carbs: 37, fat: 27 },
            { name: "Burrito Supreme - Beef", category: "Burritos", calories: 400, protein: 15, carbs: 51, fat: 14 },
            { name: "Bean Burrito", category: "Burritos", calories: 380, protein: 13, carbs: 55, fat: 11 },
            { name: "Nachos BellGrande", category: "Sides", calories: 740, protein: 16, carbs: 80, fat: 39 },
            { name: "Cinnamon Twists", category: "Desserts", calories: 170, protein: 1, carbs: 26, fat: 6 },
        ],
    },
    {
        name: "KFC",
        logo: "🍗",
        color: "#C62828",
        items: [
            { name: "Original Recipe Chicken Breast", category: "Chicken", calories: 390, protein: 39, carbs: 11, fat: 21 },
            { name: "Original Recipe Chicken Thigh", category: "Chicken", calories: 280, protein: 19, carbs: 8, fat: 19 },
            { name: "Extra Crispy Chicken Breast", category: "Chicken", calories: 530, protein: 39, carbs: 16, fat: 35 },
            { name: "Popcorn Chicken (Large)", category: "Chicken", calories: 620, protein: 31, carbs: 36, fat: 38 },
            { name: "Mashed Potatoes & Gravy", category: "Sides", calories: 130, protein: 2, carbs: 18, fat: 5 },
            { name: "Cole Slaw", category: "Sides", calories: 170, protein: 1, carbs: 14, fat: 12 },
            { name: "Mac & Cheese", category: "Sides", calories: 140, protein: 5, carbs: 16, fat: 6 },
            { name: "Biscuit", category: "Sides", calories: 180, protein: 4, carbs: 22, fat: 8 },
        ],
    },
    {
        name: "Chipotle",
        logo: "🌯",
        color: "#795548",
        items: [
            { name: "Chicken Burrito", category: "Burritos", calories: 1070, protein: 59, carbs: 105, fat: 42 },
            { name: "Steak Burrito", category: "Burritos", calories: 1040, protein: 54, carbs: 104, fat: 40 },
            { name: "Carnitas Burrito", category: "Burritos", calories: 1070, protein: 53, carbs: 105, fat: 44 },
            { name: "Chicken Bowl", category: "Bowls", calories: 745, protein: 46, carbs: 51, fat: 36 },
            { name: "Steak Bowl", category: "Bowls", calories: 715, protein: 41, carbs: 50, fat: 34 },
            { name: "Chicken Tacos (3)", category: "Tacos", calories: 615, protein: 39, carbs: 39, fat: 27 },
            { name: "Chips & Guacamole", category: "Sides", calories: 770, protein: 9, carbs: 63, fat: 53 },
            { name: "Chips & Queso", category: "Sides", calories: 750, protein: 16, carbs: 64, fat: 47 },
        ],
    },
    {
        name: "Pizza Hut",
        logo: "🍕",
        color: "#D32F2F",
        items: [
            { name: "Pepperoni Pizza (1 slice Medium)", category: "Pizza", calories: 250, protein: 11, carbs: 28, fat: 11 },
            { name: "Cheese Pizza (1 slice Medium)", category: "Pizza", calories: 220, protein: 10, carbs: 28, fat: 8 },
            { name: "Meat Lover's (1 slice Medium)", category: "Pizza", calories: 320, protein: 14, carbs: 28, fat: 17 },
            { name: "Supreme (1 slice Medium)", category: "Pizza", calories: 280, protein: 12, carbs: 29, fat: 13 },
            { name: "Breadsticks (2)", category: "Sides", calories: 290, protein: 8, carbs: 41, fat: 11 },
            { name: "Garlic Knots (4)", category: "Sides", calories: 340, protein: 8, carbs: 46, fat: 14 },
            { name: "Bone-Out Wings (4)", category: "Wings", calories: 280, protein: 19, carbs: 12, fat: 17 },
            { name: "Cinnamon Sticks", category: "Desserts", calories: 460, protein: 6, carbs: 72, fat: 16 },
        ],
    },
    {
        name: "Starbucks",
        logo: "☕",
        color: "#00695C",
        items: [
            { name: "Caffe Latte (Grande)", category: "Coffee", calories: 190, protein: 13, carbs: 19, fat: 7 },
            { name: "Cappuccino (Grande)", category: "Coffee", calories: 140, protein: 10, carbs: 14, fat: 5 },
            { name: "Caramel Frappuccino (Grande)", category: "Frappuccinos", calories: 370, protein: 5, carbs: 54, fat: 14 },
            { name: "Mocha Frappuccino (Grande)", category: "Frappuccinos", calories: 370, protein: 6, carbs: 52, fat: 15 },
            { name: "Vanilla Sweet Cream Cold Brew (Grande)", category: "Cold Brew", calories: 200, protein: 2, carbs: 26, fat: 11 },
            { name: "Bacon, Gouda & Egg Sandwich", category: "Breakfast", calories: 360, protein: 19, carbs: 34, fat: 16 },
            { name: "Sausage, Cheddar & Egg Sandwich", category: "Breakfast", calories: 480, protein: 17, carbs: 36, fat: 29 },
            { name: "Chocolate Croissant", category: "Bakery", calories: 340, protein: 6, carbs: 39, fat: 17 },
            { name: "Blueberry Muffin", category: "Bakery", calories: 360, protein: 5, carbs: 52, fat: 15 },
        ],
    },
];

export function searchRestaurants(query: string): { restaurant: Restaurant; items: MenuItem[] }[] {
    const normalizedQuery = query.toLowerCase().trim();
    const results: { restaurant: Restaurant; items: MenuItem[] }[] = [];

    for (const restaurant of RESTAURANTS) {
        // Check if searching for restaurant name
        if (restaurant.name.toLowerCase().includes(normalizedQuery)) {
            results.push({ restaurant, items: restaurant.items.slice(0, 8) });
            continue;
        }

        // Search menu items
        const matchingItems = restaurant.items.filter(
            (item) =>
                item.name.toLowerCase().includes(normalizedQuery) ||
                item.category.toLowerCase().includes(normalizedQuery)
        );

        if (matchingItems.length > 0) {
            results.push({ restaurant, items: matchingItems });
        }
    }

    return results;
}
