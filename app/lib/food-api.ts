// Open Food Facts API - Completely Free, No API Key Required
// https://world.openfoodfacts.org/

export interface NutritionData {
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
    image?: string;
}

export async function searchFood(query: string): Promise<NutritionData[]> {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
                query
            )}&search_simple=1&action=process&json=1&page_size=10`
        );

        if (!response.ok) {
            throw new Error("Failed to search foods");
        }

        const data = await response.json();

        return data.products
            .filter((p: Record<string, unknown>) => p.nutriments)
            .map((product: Record<string, unknown>) => {
                const nutriments = product.nutriments as Record<string, number>;
                return {
                    name: product.product_name || "Unknown Product",
                    brand: product.brands || undefined,
                    servingSize: product.serving_size || "100g",
                    calories: Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
                    protein: Math.round((nutriments.proteins_100g || nutriments.proteins || 0) * 10) / 10,
                    carbs: Math.round((nutriments.carbohydrates_100g || nutriments.carbohydrates || 0) * 10) / 10,
                    fat: Math.round((nutriments.fat_100g || nutriments.fat || 0) * 10) / 10,
                    fiber: nutriments.fiber_100g || nutriments.fiber,
                    sugar: nutriments.sugars_100g || nutriments.sugars,
                    sodium: nutriments.sodium_100g || nutriments.sodium,
                    image: product.image_small_url || product.image_url,
                };
            })
            .slice(0, 10);
    } catch (error) {
        console.error("Open Food Facts API error:", error);
        throw error;
    }
}

export async function getProductByBarcode(barcode: string): Promise<NutritionData | null> {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (data.status !== 1 || !data.product) {
            return null;
        }

        const product = data.product;
        const nutriments = product.nutriments || {};

        return {
            name: product.product_name || "Unknown Product",
            brand: product.brands || undefined,
            servingSize: product.serving_size || "100g",
            calories: Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
            protein: Math.round((nutriments.proteins_100g || nutriments.proteins || 0) * 10) / 10,
            carbs: Math.round((nutriments.carbohydrates_100g || nutriments.carbohydrates || 0) * 10) / 10,
            fat: Math.round((nutriments.fat_100g || nutriments.fat || 0) * 10) / 10,
            fiber: nutriments.fiber_100g || nutriments.fiber,
            sugar: nutriments.sugars_100g || nutriments.sugars,
            sodium: nutriments.sodium_100g || nutriments.sodium,
            image: product.image_small_url || product.image_url,
        };
    } catch (error) {
        console.error("Barcode lookup error:", error);
        return null;
    }
}

// Common whole foods with approximate nutrition (per 100g)
export const COMMON_FOODS: Record<string, NutritionData> = {
    tomato: {
        name: "Tomato",
        servingSize: "1 medium (123g)",
        calories: 22,
        protein: 1.1,
        carbs: 4.8,
        fat: 0.2,
        fiber: 1.5,
        sugar: 3.2,
    },
    olive_oil: {
        name: "Olive Oil",
        servingSize: "1 tbsp (14g)",
        calories: 119,
        protein: 0,
        carbs: 0,
        fat: 13.5,
    },
    chicken_breast: {
        name: "Chicken Breast",
        servingSize: "100g",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
    },
    rice: {
        name: "White Rice (cooked)",
        servingSize: "1 cup (158g)",
        calories: 206,
        protein: 4.3,
        carbs: 45,
        fat: 0.4,
        fiber: 0.6,
    },
    egg: {
        name: "Egg",
        servingSize: "1 large (50g)",
        calories: 72,
        protein: 6.3,
        carbs: 0.4,
        fat: 4.8,
    },
    banana: {
        name: "Banana",
        servingSize: "1 medium (118g)",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        fiber: 3.1,
        sugar: 14,
    },
    avocado: {
        name: "Avocado",
        servingSize: "1/2 fruit (100g)",
        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 15,
        fiber: 7,
    },
    salmon: {
        name: "Salmon",
        servingSize: "100g",
        calories: 208,
        protein: 20,
        carbs: 0,
        fat: 13,
    },
    broccoli: {
        name: "Broccoli",
        servingSize: "1 cup (91g)",
        calories: 31,
        protein: 2.5,
        carbs: 6,
        fat: 0.3,
        fiber: 2.4,
    },
    potato: {
        name: "Potato",
        servingSize: "1 medium (150g)",
        calories: 163,
        protein: 4.3,
        carbs: 37,
        fat: 0.2,
        fiber: 3.8,
    },
};

export function findCommonFood(query: string): NutritionData | null {
    const normalizedQuery = query.toLowerCase().trim();

    for (const [key, food] of Object.entries(COMMON_FOODS)) {
        if (
            key.includes(normalizedQuery) ||
            normalizedQuery.includes(key) ||
            food.name.toLowerCase().includes(normalizedQuery)
        ) {
            return food;
        }
    }

    return null;
}
