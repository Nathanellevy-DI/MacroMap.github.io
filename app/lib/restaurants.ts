// Extended Restaurant Menu Database
// 25+ chains with 200+ menu items

export interface MenuItem {
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Restaurant {
    name: string;
    logo: string;
    color: string;
    items: MenuItem[];
}

export const RESTAURANTS: Restaurant[] = [
    // BURGERS
    {
        name: "McDonald's",
        logo: "🍟",
        color: "#FFC107",
        items: [
            { name: "Big Mac", category: "Burgers", calories: 550, protein: 25, carbs: 45, fat: 30 },
            { name: "Quarter Pounder w/ Cheese", category: "Burgers", calories: 520, protein: 30, carbs: 42, fat: 26 },
            { name: "McDouble", category: "Burgers", calories: 400, protein: 22, carbs: 33, fat: 20 },
            { name: "McChicken", category: "Burgers", calories: 400, protein: 14, carbs: 40, fat: 21 },
            { name: "Filet-O-Fish", category: "Burgers", calories: 390, protein: 16, carbs: 39, fat: 19 },
            { name: "Double Cheeseburger", category: "Burgers", calories: 450, protein: 25, carbs: 34, fat: 24 },
            { name: "Chicken McNuggets (10pc)", category: "Chicken", calories: 420, protein: 25, carbs: 26, fat: 25 },
            { name: "Chicken McNuggets (20pc)", category: "Chicken", calories: 840, protein: 50, carbs: 52, fat: 50 },
            { name: "Medium Fries", category: "Sides", calories: 320, protein: 5, carbs: 43, fat: 15 },
            { name: "Large Fries", category: "Sides", calories: 480, protein: 7, carbs: 64, fat: 23 },
            { name: "McFlurry Oreo", category: "Desserts", calories: 510, protein: 11, carbs: 80, fat: 17 },
            { name: "Apple Pie", category: "Desserts", calories: 230, protein: 2, carbs: 32, fat: 11 },
            { name: "Egg McMuffin", category: "Breakfast", calories: 310, protein: 17, carbs: 30, fat: 13 },
            { name: "Sausage McMuffin w/ Egg", category: "Breakfast", calories: 480, protein: 21, carbs: 30, fat: 31 },
            { name: "Hotcakes", category: "Breakfast", calories: 580, protein: 9, carbs: 102, fat: 15 },
            { name: "Hash Browns", category: "Breakfast", calories: 150, protein: 1, carbs: 15, fat: 9 },
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
            { name: "Big King", category: "Burgers", calories: 530, protein: 29, carbs: 39, fat: 30 },
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
            { name: "Dave's Triple", category: "Burgers", calories: 1110, protein: 68, carbs: 44, fat: 72 },
            { name: "Baconator", category: "Burgers", calories: 950, protein: 57, carbs: 40, fat: 62 },
            { name: "Jr. Bacon Cheeseburger", category: "Burgers", calories: 380, protein: 18, carbs: 27, fat: 22 },
            { name: "Spicy Chicken Sandwich", category: "Chicken", calories: 500, protein: 29, carbs: 49, fat: 20 },
            { name: "Grilled Chicken Sandwich", category: "Chicken", calories: 360, protein: 35, carbs: 36, fat: 8 },
            { name: "10pc Chicken Nuggets", category: "Chicken", calories: 450, protein: 22, carbs: 29, fat: 27 },
            { name: "Medium Fries", category: "Sides", calories: 420, protein: 5, carbs: 52, fat: 21 },
            { name: "Chili (Large)", category: "Sides", calories: 330, protein: 25, carbs: 30, fat: 12 },
            { name: "Baked Potato (Plain)", category: "Sides", calories: 270, protein: 7, carbs: 61, fat: 0 },
            { name: "Frosty (Medium)", category: "Desserts", calories: 470, protein: 11, carbs: 76, fat: 13 },
        ],
    },
    {
        name: "Five Guys",
        logo: "🍔",
        color: "#C62828",
        items: [
            { name: "Hamburger", category: "Burgers", calories: 700, protein: 39, carbs: 39, fat: 43 },
            { name: "Cheeseburger", category: "Burgers", calories: 840, protein: 47, carbs: 40, fat: 55 },
            { name: "Bacon Burger", category: "Burgers", calories: 780, protein: 45, carbs: 39, fat: 50 },
            { name: "Bacon Cheeseburger", category: "Burgers", calories: 920, protein: 53, carbs: 40, fat: 62 },
            { name: "Little Hamburger", category: "Burgers", calories: 480, protein: 23, carbs: 39, fat: 26 },
            { name: "Hot Dog", category: "Hot Dogs", calories: 545, protein: 18, carbs: 40, fat: 35 },
            { name: "Cheese Dog", category: "Hot Dogs", calories: 615, protein: 22, carbs: 41, fat: 41 },
            { name: "Regular Fries", category: "Sides", calories: 620, protein: 10, carbs: 78, fat: 30 },
            { name: "Large Fries", category: "Sides", calories: 953, protein: 15, carbs: 120, fat: 46 },
            { name: "Grilled Cheese", category: "Sandwiches", calories: 470, protein: 16, carbs: 41, fat: 26 },
        ],
    },
    {
        name: "In-N-Out",
        logo: "🌴",
        color: "#FFD600",
        items: [
            { name: "Hamburger", category: "Burgers", calories: 390, protein: 16, carbs: 39, fat: 19 },
            { name: "Cheeseburger", category: "Burgers", calories: 480, protein: 22, carbs: 39, fat: 27 },
            { name: "Double-Double", category: "Burgers", calories: 670, protein: 37, carbs: 39, fat: 41 },
            { name: "Animal Style Burger", category: "Burgers", calories: 490, protein: 16, carbs: 41, fat: 27 },
            { name: "Protein Style Burger", category: "Burgers", calories: 330, protein: 18, carbs: 11, fat: 25 },
            { name: "French Fries", category: "Sides", calories: 395, protein: 7, carbs: 54, fat: 18 },
            { name: "Chocolate Shake", category: "Drinks", calories: 590, protein: 9, carbs: 83, fat: 29 },
            { name: "Vanilla Shake", category: "Drinks", calories: 580, protein: 9, carbs: 78, fat: 31 },
        ],
    },
    {
        name: "Shake Shack",
        logo: "🍦",
        color: "#2E7D32",
        items: [
            { name: "ShackBurger", category: "Burgers", calories: 530, protein: 29, carbs: 27, fat: 34 },
            { name: "SmokeShack", category: "Burgers", calories: 610, protein: 32, carbs: 28, fat: 41 },
            { name: "Shack Stack", category: "Burgers", calories: 830, protein: 44, carbs: 61, fat: 46 },
            { name: "Chicken Shack", category: "Chicken", calories: 610, protein: 36, carbs: 52, fat: 29 },
            { name: "Crinkle Cut Fries", category: "Sides", calories: 470, protein: 6, carbs: 63, fat: 22 },
            { name: "Cheese Fries", category: "Sides", calories: 630, protein: 16, carbs: 65, fat: 33 },
            { name: "Vanilla Shake", category: "Shakes", calories: 690, protein: 11, carbs: 84, fat: 34 },
            { name: "Chocolate Shake", category: "Shakes", calories: 740, protein: 13, carbs: 94, fat: 35 },
        ],
    },
    // CHICKEN
    {
        name: "Chick-fil-A",
        logo: "🐔",
        color: "#E53935",
        items: [
            { name: "Chick-fil-A Sandwich", category: "Chicken", calories: 440, protein: 29, carbs: 40, fat: 18 },
            { name: "Spicy Chicken Sandwich", category: "Chicken", calories: 460, protein: 29, carbs: 42, fat: 19 },
            { name: "Deluxe Sandwich", category: "Chicken", calories: 500, protein: 30, carbs: 43, fat: 22 },
            { name: "Grilled Chicken Sandwich", category: "Chicken", calories: 320, protein: 28, carbs: 36, fat: 6 },
            { name: "Grilled Nuggets (8pc)", category: "Chicken", calories: 130, protein: 25, carbs: 1, fat: 3 },
            { name: "Chicken Nuggets (12pc)", category: "Chicken", calories: 380, protein: 40, carbs: 16, fat: 18 },
            { name: "Waffle Fries (Medium)", category: "Sides", calories: 420, protein: 5, carbs: 45, fat: 24 },
            { name: "Mac & Cheese", category: "Sides", calories: 450, protein: 15, carbs: 41, fat: 25 },
            { name: "Chicken Biscuit", category: "Breakfast", calories: 460, protein: 18, carbs: 44, fat: 23 },
            { name: "Hash Brown Scramble Bowl", category: "Breakfast", calories: 460, protein: 23, carbs: 24, fat: 30 },
            { name: "Frosted Lemonade", category: "Drinks", calories: 330, protein: 6, carbs: 64, fat: 6 },
        ],
    },
    {
        name: "KFC",
        logo: "🍗",
        color: "#C62828",
        items: [
            { name: "Original Recipe Breast", category: "Chicken", calories: 390, protein: 39, carbs: 11, fat: 21 },
            { name: "Original Recipe Thigh", category: "Chicken", calories: 280, protein: 19, carbs: 8, fat: 19 },
            { name: "Original Recipe Drumstick", category: "Chicken", calories: 130, protein: 13, carbs: 4, fat: 7 },
            { name: "Extra Crispy Breast", category: "Chicken", calories: 530, protein: 39, carbs: 16, fat: 35 },
            { name: "Popcorn Chicken (Large)", category: "Chicken", calories: 620, protein: 31, carbs: 36, fat: 38 },
            { name: "Chicken Sandwich", category: "Sandwiches", calories: 650, protein: 28, carbs: 48, fat: 38 },
            { name: "Mashed Potatoes & Gravy", category: "Sides", calories: 130, protein: 2, carbs: 18, fat: 5 },
            { name: "Cole Slaw", category: "Sides", calories: 170, protein: 1, carbs: 14, fat: 12 },
            { name: "Mac & Cheese", category: "Sides", calories: 140, protein: 5, carbs: 16, fat: 6 },
            { name: "Biscuit", category: "Sides", calories: 180, protein: 4, carbs: 22, fat: 8 },
            { name: "Famous Bowl", category: "Bowls", calories: 740, protein: 26, carbs: 80, fat: 35 },
        ],
    },
    {
        name: "Popeyes",
        logo: "🍗",
        color: "#FF6F00",
        items: [
            { name: "Chicken Sandwich", category: "Sandwiches", calories: 700, protein: 28, carbs: 50, fat: 42 },
            { name: "Spicy Chicken Sandwich", category: "Sandwiches", calories: 700, protein: 28, carbs: 50, fat: 42 },
            { name: "Mild Breast", category: "Chicken", calories: 380, protein: 21, carbs: 17, fat: 25 },
            { name: "Spicy Breast", category: "Chicken", calories: 360, protein: 21, carbs: 15, fat: 24 },
            { name: "Chicken Tenders (5pc)", category: "Chicken", calories: 685, protein: 42, carbs: 44, fat: 37 },
            { name: "Cajun Fries (Regular)", category: "Sides", calories: 270, protein: 4, carbs: 35, fat: 14 },
            { name: "Mashed Potatoes", category: "Sides", calories: 110, protein: 2, carbs: 16, fat: 5 },
            { name: "Red Beans & Rice", category: "Sides", calories: 230, protein: 7, carbs: 24, fat: 12 },
            { name: "Biscuit", category: "Sides", calories: 200, protein: 3, carbs: 25, fat: 10 },
        ],
    },
    {
        name: "Wingstop",
        logo: "🍗",
        color: "#00796B",
        items: [
            { name: "Classic Wings (10pc)", category: "Wings", calories: 760, protein: 68, carbs: 6, fat: 52 },
            { name: "Boneless Wings (10pc)", category: "Wings", calories: 870, protein: 56, carbs: 68, fat: 42 },
            { name: "Crispy Tenders (5pc)", category: "Tenders", calories: 550, protein: 42, carbs: 36, fat: 27 },
            { name: "Large Fries", category: "Sides", calories: 610, protein: 6, carbs: 76, fat: 33 },
            { name: "Cajun Fried Corn", category: "Sides", calories: 570, protein: 6, carbs: 48, fat: 42 },
        ],
    },
    // MEXICAN
    {
        name: "Taco Bell",
        logo: "🌮",
        color: "#7B1FA2",
        items: [
            { name: "Crunchy Taco", category: "Tacos", calories: 170, protein: 8, carbs: 13, fat: 10 },
            { name: "Soft Taco", category: "Tacos", calories: 180, protein: 9, carbs: 18, fat: 9 },
            { name: "Doritos Locos Taco", category: "Tacos", calories: 170, protein: 8, carbs: 13, fat: 10 },
            { name: "Crunchwrap Supreme", category: "Specialties", calories: 530, protein: 16, carbs: 55, fat: 21 },
            { name: "Mexican Pizza", category: "Specialties", calories: 540, protein: 20, carbs: 47, fat: 30 },
            { name: "Chalupa Supreme - Beef", category: "Specialties", calories: 350, protein: 14, carbs: 30, fat: 21 },
            { name: "Quesadilla - Chicken", category: "Specialties", calories: 510, protein: 27, carbs: 37, fat: 27 },
            { name: "Burrito Supreme - Beef", category: "Burritos", calories: 400, protein: 15, carbs: 51, fat: 14 },
            { name: "Bean Burrito", category: "Burritos", calories: 380, protein: 13, carbs: 55, fat: 11 },
            { name: "Cheesy Gordita Crunch", category: "Specialties", calories: 500, protein: 20, carbs: 41, fat: 28 },
            { name: "Nachos BellGrande", category: "Sides", calories: 740, protein: 16, carbs: 80, fat: 39 },
            { name: "Cinnamon Twists", category: "Desserts", calories: 170, protein: 1, carbs: 26, fat: 6 },
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
            { name: "Barbacoa Burrito", category: "Burritos", calories: 1030, protein: 52, carbs: 104, fat: 39 },
            { name: "Sofritas Burrito", category: "Burritos", calories: 930, protein: 32, carbs: 115, fat: 36 },
            { name: "Chicken Bowl", category: "Bowls", calories: 745, protein: 46, carbs: 51, fat: 36 },
            { name: "Steak Bowl", category: "Bowls", calories: 715, protein: 41, carbs: 50, fat: 34 },
            { name: "Chicken Tacos (3)", category: "Tacos", calories: 615, protein: 39, carbs: 39, fat: 27 },
            { name: "Chips & Guacamole", category: "Sides", calories: 770, protein: 9, carbs: 63, fat: 53 },
            { name: "Chips & Queso", category: "Sides", calories: 750, protein: 16, carbs: 64, fat: 47 },
            { name: "Side of Guacamole", category: "Sides", calories: 230, protein: 3, carbs: 8, fat: 22 },
        ],
    },
    {
        name: "Qdoba",
        logo: "🌯",
        color: "#D84315",
        items: [
            { name: "Chicken Burrito", category: "Burritos", calories: 930, protein: 50, carbs: 92, fat: 38 },
            { name: "Steak Burrito", category: "Burritos", calories: 1010, protein: 54, carbs: 93, fat: 43 },
            { name: "3 Cheese Nachos", category: "Nachos", calories: 1050, protein: 29, carbs: 100, fat: 58 },
            { name: "Chicken Quesadilla", category: "Quesadillas", calories: 920, protein: 48, carbs: 66, fat: 51 },
            { name: "Chicken Bowl", category: "Bowls", calories: 610, protein: 43, carbs: 55, fat: 24 },
            { name: "Chips & Salsa", category: "Sides", calories: 340, protein: 5, carbs: 47, fat: 15 },
        ],
    },
    // SUBS & SANDWICHES
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
            { name: "6\" Cold Cut Combo", category: "Subs", calories: 360, protein: 17, carbs: 45, fat: 13 },
            { name: "6\" Steak & Cheese", category: "Subs", calories: 380, protein: 26, carbs: 45, fat: 12 },
            { name: "Footlong Italian B.M.T.", category: "Subs", calories: 820, protein: 42, carbs: 88, fat: 34 },
            { name: "Footlong Turkey Breast", category: "Subs", calories: 560, protein: 36, carbs: 92, fat: 6 },
            { name: "Cookies (2)", category: "Desserts", calories: 400, protein: 4, carbs: 56, fat: 18 },
        ],
    },
    {
        name: "Jersey Mike's",
        logo: "🥖",
        color: "#C62828",
        items: [
            { name: "Regular #13 Italian", category: "Cold Subs", calories: 900, protein: 44, carbs: 68, fat: 51 },
            { name: "Regular #2 Jersey Shore", category: "Cold Subs", calories: 670, protein: 37, carbs: 67, fat: 28 },
            { name: "Regular #7 Turkey & Provolone", category: "Cold Subs", calories: 580, protein: 34, carbs: 66, fat: 19 },
            { name: "Regular #17 Philly", category: "Hot Subs", calories: 660, protein: 38, carbs: 68, fat: 26 },
            { name: "Regular #42 Chipotle Cheesesteak", category: "Hot Subs", calories: 720, protein: 41, carbs: 69, fat: 31 },
            { name: "Regular #43 Chicken Philly", category: "Hot Subs", calories: 570, protein: 37, carbs: 68, fat: 15 },
        ],
    },
    {
        name: "Jimmy John's",
        logo: "🥪",
        color: "#000000",
        items: [
            { name: "#1 Pepe", category: "Subs", calories: 570, protein: 25, carbs: 49, fat: 30 },
            { name: "#4 Turkey Tom", category: "Subs", calories: 510, protein: 26, carbs: 50, fat: 23 },
            { name: "#5 Vito", category: "Subs", calories: 610, protein: 28, carbs: 50, fat: 33 },
            { name: "#9 Italian Night Club", category: "Subs", calories: 750, protein: 38, carbs: 52, fat: 43 },
            { name: "#12 Beach Club", category: "Subs", calories: 740, protein: 43, carbs: 52, fat: 40 },
            { name: "J.J. B.L.T.", category: "Subs", calories: 660, protein: 23, carbs: 51, fat: 40 },
        ],
    },
    {
        name: "Firehouse Subs",
        logo: "🔥",
        color: "#D32F2F",
        items: [
            { name: "Medium Hook & Ladder", category: "Subs", calories: 720, protein: 40, carbs: 65, fat: 33 },
            { name: "Medium Meatball", category: "Subs", calories: 830, protein: 42, carbs: 78, fat: 38 },
            { name: "Medium Italian", category: "Subs", calories: 910, protein: 39, carbs: 66, fat: 54 },
            { name: "Medium Steak & Cheese", category: "Subs", calories: 680, protein: 39, carbs: 62, fat: 30 },
            { name: "Medium Turkey Bacon Ranch", category: "Subs", calories: 710, protein: 42, carbs: 63, fat: 32 },
        ],
    },
    // PIZZA
    {
        name: "Pizza Hut",
        logo: "🍕",
        color: "#D32F2F",
        items: [
            { name: "Pepperoni (1 slice Med)", category: "Pizza", calories: 250, protein: 11, carbs: 28, fat: 11 },
            { name: "Cheese (1 slice Med)", category: "Pizza", calories: 220, protein: 10, carbs: 28, fat: 8 },
            { name: "Meat Lover's (1 slice Med)", category: "Pizza", calories: 320, protein: 14, carbs: 28, fat: 17 },
            { name: "Supreme (1 slice Med)", category: "Pizza", calories: 280, protein: 12, carbs: 29, fat: 13 },
            { name: "Veggie Lover's (1 slice Med)", category: "Pizza", calories: 210, protein: 9, carbs: 28, fat: 7 },
            { name: "Breadsticks (2)", category: "Sides", calories: 290, protein: 8, carbs: 41, fat: 11 },
            { name: "Bone-Out Wings (4)", category: "Wings", calories: 280, protein: 19, carbs: 12, fat: 17 },
            { name: "Cinnamon Sticks", category: "Desserts", calories: 460, protein: 6, carbs: 72, fat: 16 },
        ],
    },
    {
        name: "Domino's",
        logo: "🍕",
        color: "#006491",
        items: [
            { name: "Pepperoni (1 slice Med)", category: "Pizza", calories: 220, protein: 9, carbs: 25, fat: 10 },
            { name: "Cheese (1 slice Med)", category: "Pizza", calories: 200, protein: 8, carbs: 25, fat: 7 },
            { name: "ExtravaganZZa (1 slice Med)", category: "Pizza", calories: 260, protein: 11, carbs: 27, fat: 12 },
            { name: "MeatZZa (1 slice Med)", category: "Pizza", calories: 280, protein: 12, carbs: 26, fat: 14 },
            { name: "Parmesan Bread Bites", category: "Sides", calories: 170, protein: 4, carbs: 22, fat: 7 },
            { name: "Boneless Chicken (8pc)", category: "Chicken", calories: 540, protein: 35, carbs: 30, fat: 30 },
            { name: "Cinna Stix", category: "Desserts", calories: 250, protein: 4, carbs: 31, fat: 12 },
        ],
    },
    {
        name: "Papa John's",
        logo: "🍕",
        color: "#007D4A",
        items: [
            { name: "Pepperoni (1 slice Large)", category: "Pizza", calories: 310, protein: 13, carbs: 35, fat: 13 },
            { name: "Cheese (1 slice Large)", category: "Pizza", calories: 280, protein: 12, carbs: 35, fat: 10 },
            { name: "The Works (1 slice Large)", category: "Pizza", calories: 330, protein: 14, carbs: 36, fat: 15 },
            { name: "Garlic Knots (4)", category: "Sides", calories: 320, protein: 7, carbs: 40, fat: 14 },
            { name: "Chicken Poppers (8)", category: "Sides", calories: 540, protein: 29, carbs: 36, fat: 32 },
        ],
    },
    {
        name: "Little Caesars",
        logo: "🍕",
        color: "#F57C00",
        items: [
            { name: "HOT-N-READY Pepperoni (1 slice)", category: "Pizza", calories: 280, protein: 12, carbs: 31, fat: 12 },
            { name: "HOT-N-READY Cheese (1 slice)", category: "Pizza", calories: 250, protein: 11, carbs: 31, fat: 9 },
            { name: "Deep! Deep! Dish Pepperoni (1 slice)", category: "Pizza", calories: 360, protein: 15, carbs: 37, fat: 17 },
            { name: "Crazy Bread (1 stick)", category: "Sides", calories: 100, protein: 3, carbs: 15, fat: 3 },
            { name: "Italian Cheese Bread (4 pc)", category: "Sides", calories: 390, protein: 14, carbs: 44, fat: 18 },
        ],
    },
    // COFFEE & BREAKFAST
    {
        name: "Starbucks",
        logo: "☕",
        color: "#00695C",
        items: [
            { name: "Caffe Latte (Grande)", category: "Coffee", calories: 190, protein: 13, carbs: 19, fat: 7 },
            { name: "Cappuccino (Grande)", category: "Coffee", calories: 140, protein: 10, carbs: 14, fat: 5 },
            { name: "Caramel Macchiato (Grande)", category: "Coffee", calories: 250, protein: 10, carbs: 35, fat: 7 },
            { name: "Caramel Frappuccino (Grande)", category: "Frappuccinos", calories: 370, protein: 5, carbs: 54, fat: 14 },
            { name: "Mocha Frappuccino (Grande)", category: "Frappuccinos", calories: 370, protein: 6, carbs: 52, fat: 15 },
            { name: "Vanilla Sweet Cream Cold Brew (Grande)", category: "Cold Brew", calories: 200, protein: 2, carbs: 26, fat: 11 },
            { name: "Pink Drink (Grande)", category: "Refreshers", calories: 140, protein: 1, carbs: 27, fat: 2 },
            { name: "Dragon Drink (Grande)", category: "Refreshers", calories: 130, protein: 1, carbs: 26, fat: 2 },
            { name: "Bacon, Gouda & Egg Sandwich", category: "Breakfast", calories: 360, protein: 19, carbs: 34, fat: 16 },
            { name: "Sausage, Cheddar & Egg Sandwich", category: "Breakfast", calories: 480, protein: 17, carbs: 36, fat: 29 },
            { name: "Chocolate Croissant", category: "Bakery", calories: 340, protein: 6, carbs: 39, fat: 17 },
            { name: "Blueberry Muffin", category: "Bakery", calories: 360, protein: 5, carbs: 52, fat: 15 },
            { name: "Cake Pop", category: "Bakery", calories: 180, protein: 2, carbs: 22, fat: 9 },
        ],
    },
    {
        name: "Dunkin'",
        logo: "🍩",
        color: "#FF6F00",
        items: [
            { name: "Medium Latte", category: "Coffee", calories: 120, protein: 10, carbs: 12, fat: 4 },
            { name: "Medium Iced Latte", category: "Coffee", calories: 120, protein: 10, carbs: 12, fat: 4 },
            { name: "Medium Cold Brew", category: "Coffee", calories: 5, protein: 0, carbs: 1, fat: 0 },
            { name: "Medium Caramel Swirl Latte", category: "Coffee", calories: 260, protein: 9, carbs: 43, fat: 6 },
            { name: "Glazed Donut", category: "Donuts", calories: 240, protein: 3, carbs: 31, fat: 11 },
            { name: "Boston Kreme Donut", category: "Donuts", calories: 280, protein: 3, carbs: 38, fat: 13 },
            { name: "Chocolate Frosted Donut", category: "Donuts", calories: 260, protein: 3, carbs: 31, fat: 14 },
            { name: "Munchkins (5)", category: "Donuts", calories: 280, protein: 3, carbs: 35, fat: 15 },
            { name: "Bacon Egg Cheese Croissant", category: "Breakfast", calories: 510, protein: 19, carbs: 40, fat: 31 },
            { name: "Sausage Egg Cheese Wake-Up Wrap", category: "Breakfast", calories: 290, protein: 12, carbs: 15, fat: 20 },
            { name: "Hash Browns (6)", category: "Sides", calories: 140, protein: 2, carbs: 18, fat: 7 },
        ],
    },
    // CASUAL DINING
    {
        name: "Panda Express",
        logo: "🐼",
        color: "#C62828",
        items: [
            { name: "Orange Chicken", category: "Entrees", calories: 490, protein: 25, carbs: 51, fat: 23 },
            { name: "Beijing Beef", category: "Entrees", calories: 470, protein: 14, carbs: 46, fat: 26 },
            { name: "Kung Pao Chicken", category: "Entrees", calories: 290, protein: 16, carbs: 14, fat: 19 },
            { name: "Broccoli Beef", category: "Entrees", calories: 150, protein: 9, carbs: 13, fat: 7 },
            { name: "Honey Walnut Shrimp", category: "Entrees", calories: 360, protein: 13, carbs: 35, fat: 23 },
            { name: "Teriyaki Chicken", category: "Entrees", calories: 275, protein: 32, carbs: 10, fat: 12 },
            { name: "Fried Rice", category: "Sides", calories: 520, protein: 11, carbs: 85, fat: 16 },
            { name: "Chow Mein", category: "Sides", calories: 510, protein: 13, carbs: 80, fat: 22 },
            { name: "White Steamed Rice", category: "Sides", calories: 380, protein: 7, carbs: 87, fat: 0 },
        ],
    },
    {
        name: "Panera Bread",
        logo: "🥖",
        color: "#7AA942",
        items: [
            { name: "Broccoli Cheddar Soup (Bowl)", category: "Soups", calories: 360, protein: 15, carbs: 29, fat: 21 },
            { name: "Bread Bowl Broccoli Cheddar", category: "Soups", calories: 870, protein: 33, carbs: 118, fat: 27 },
            { name: "Chicken Noodle Soup (Bowl)", category: "Soups", calories: 170, protein: 16, carbs: 17, fat: 4 },
            { name: "Bacon Turkey Bravo", category: "Sandwiches", calories: 710, protein: 43, carbs: 67, fat: 29 },
            { name: "Napa Almond Chicken Salad Sandwich", category: "Sandwiches", calories: 690, protein: 30, carbs: 65, fat: 33 },
            { name: "Mac & Cheese (Large)", category: "Mac & Cheese", calories: 980, protein: 34, carbs: 98, fat: 48 },
            { name: "Caesar Salad (Whole)", category: "Salads", calories: 330, protein: 10, carbs: 15, fat: 26 },
            { name: "Chocolate Chip Cookie", category: "Bakery", calories: 390, protein: 3, carbs: 52, fat: 19 },
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
        ],
    },
];

export function searchRestaurants(query: string): { restaurant: Restaurant; items: MenuItem[] }[] {
    const normalizedQuery = query.toLowerCase().trim();
    const results: { restaurant: Restaurant; items: MenuItem[] }[] = [];

    for (const restaurant of RESTAURANTS) {
        if (restaurant.name.toLowerCase().includes(normalizedQuery)) {
            results.push({ restaurant, items: restaurant.items.slice(0, 10) });
            continue;
        }

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

export function getAllRestaurantCount(): { restaurants: number; items: number } {
    let items = 0;
    RESTAURANTS.forEach(r => items += r.items.length);
    return { restaurants: RESTAURANTS.length, items };
}
