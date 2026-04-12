/* ============================================
   MacroMap — Open Food Facts API (Free, No Key)
   ============================================ */

export interface NutritionSearchResult {
  name: string;
  brand?: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  image?: string;
}

export async function searchFood(query: string): Promise<NutritionSearchResult[]> {
  if (query.length < 2) return [];

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`
    );
    if (!res.ok) return [];

    const data = await res.json();

    return (data.products || [])
      .filter((p: Record<string, unknown>) => p.nutriments && p.product_name)
      .map((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, number>;
        return {
          name: (p.product_name as string) || 'Unknown',
          brand: (p.brands as string) || undefined,
          servingSize: (p.serving_size as string) || '100g',
          calories: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
          protein: Math.round((n.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((n.fat_100g || 0) * 10) / 10,
          fiber: n.fiber_100g ? Math.round(n.fiber_100g * 10) / 10 : undefined,
          image: (p.image_small_url as string) || (p.image_url as string) || undefined,
        };
      })
      .slice(0, 10);
  } catch {
    return [];
  }
}

export async function lookupBarcode(barcode: string): Promise<NutritionSearchResult | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const n = p.nutriments || {};

    return {
      name: p.product_name || 'Unknown Product',
      brand: p.brands || undefined,
      servingSize: p.serving_size || '100g',
      calories: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
      protein: Math.round((n.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
      fat: Math.round((n.fat_100g || 0) * 10) / 10,
      fiber: n.fiber_100g ? Math.round(n.fiber_100g * 10) / 10 : undefined,
      image: p.image_small_url || p.image_url || undefined,
    };
  } catch {
    return null;
  }
}
