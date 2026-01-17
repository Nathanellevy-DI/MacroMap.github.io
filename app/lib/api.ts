"use client";

import { AnalysisResult, MealAnalysisResult } from "../types";

const INGREDIENT_SYSTEM_PROMPT = `You are the "MacroMap Audit Engine", a strict health-first analyzer comparing food safety standards between the US and the EU (2026 standards).

Your task:
1. Receive a list of ingredients (text or OCR output from an image).
2. Identify "Red Flag" ingredients based on EU bans and health risks. Key ingredients to watch for:
   - Titanium Dioxide (E171): Genotoxicity risk, banned in EU
   - Potassium Bromate: Carcinogen, banned in EU since 1990
   - BVO (Brominated Vegetable Oil): Thyroid toxin, banned in EU & Japan
   - Propylparaben: Endocrine disruptor, banned in EU
   - Red Dye No. 3 (Erythrosine): Linked to thyroid tumors, banned in EU food
   - Azodicarbonamide: "Yoga mat chemical", linked to asthma, banned in EU
   - Red 40, Yellow 5, Yellow 6: Require warning labels in EU
   - TBHQ, BHA, BHT: Restricted or banned in some EU applications
3. For each match, determine:
   - The specific health risk (short, punchy - max 15 words)
   - The EU status (e.g., "Banned in EU since 1990")
   - Common aliases (e.g., "Artificial Color" might be Titanium Dioxide)
4. Generate a "Precautionary Score" (0-100, where 100 is fully safe/EU compliant, 0 is extremely problematic)
5. If applicable, briefly mention how this product might be reformulated in the EU

IMPORTANT: Extract ALL ingredients from the image/text and list them in "all_ingredients".

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "score": number,
  "red_flags": [
    {
      "name": "Ingredient Name",
      "risk": "Short health risk description",
      "eu_status": "Banned/Restricted status",
      "alias": "Common alias if found differently on label"
    }
  ],
  "reformulation_note": "Brief note about EU version if applicable",
  "all_ingredients": ["ingredient1", "ingredient2", ...]
}`;

const MACRO_SYSTEM_PROMPT = `You are a precise nutrition analyzer. Your task is to extract macro-nutrient information from food packaging labels or identify nutritional content of whole foods.

When shown an image of:
1. Food packaging nutrition label - Extract exact values from the label
2. Whole food (fruit, vegetable, meat, etc.) - Estimate based on standard USDA values
3. Recipe ingredient - Provide typical nutritional values

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "food_item": {
    "name": "Food name",
    "brand": "Brand name if visible, or null",
    "serving_size": "e.g., 100g, 1 cup, 1 medium",
    "calories": number,
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams),
    "fiber": number (grams, optional),
    "sugar": number (grams, optional),
    "sodium": number (mg, optional)
  }
}

Be as accurate as possible. If you cannot determine exact values, provide best estimates based on typical nutritional data.`;

async function callOpenAI(
    imageBase64: string,
    apiKey: string,
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: userPrompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                                detail: "high",
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1500,
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to analyze image");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        throw new Error("No response from AI");
    }

    return content;
}

function parseJSON<T>(content: string): T {
    try {
        return JSON.parse(content);
    } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Failed to parse AI response");
    }
}

export async function analyzeImage(
    imageBase64: string,
    apiKey: string
): Promise<AnalysisResult> {
    const content = await callOpenAI(
        imageBase64,
        apiKey,
        INGREDIENT_SYSTEM_PROMPT,
        "Analyze the ingredients in this food label image. Extract all ingredients and identify any that are banned or restricted in the EU."
    );
    return parseJSON<AnalysisResult>(content);
}

export async function analyzeMacros(
    imageBase64: string,
    apiKey: string
): Promise<MealAnalysisResult> {
    const content = await callOpenAI(
        imageBase64,
        apiKey,
        MACRO_SYSTEM_PROMPT,
        "Extract the nutritional information from this food image. If it's a nutrition label, read the exact values. If it's a whole food, estimate based on typical values."
    );
    return parseJSON<MealAnalysisResult>(content);
}

export function getApiKey(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("macromap_api_key");
}

export function setApiKey(key: string): void {
    localStorage.setItem("macromap_api_key", key);
}

export function removeApiKey(): void {
    localStorage.removeItem("macromap_api_key");
}
