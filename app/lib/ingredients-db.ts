// EU Banned Ingredients Database (2026)
// This is a local database - no AI required

export interface BannedIngredient {
    name: string;
    aliases: string[];
    risk: string;
    euStatus: string;
    category: string;
}

export const BANNED_INGREDIENTS: BannedIngredient[] = [
    {
        name: "Titanium Dioxide",
        aliases: ["E171", "titanium oxide", "CI 77891", "titanium white"],
        risk: "Genotoxicity risk: potential DNA damage",
        euStatus: "Banned in EU since 2022",
        category: "Colorant",
    },
    {
        name: "Potassium Bromate",
        aliases: ["E924", "potassium bromate", "bromate"],
        risk: "Known carcinogen linked to kidney and thyroid tumors",
        euStatus: "Banned in EU since 1990",
        category: "Flour Treatment",
    },
    {
        name: "Brominated Vegetable Oil",
        aliases: ["BVO", "brominated vegetable oil", "brominated oil"],
        risk: "Thyroid toxin and neurological concerns",
        euStatus: "Banned in EU and Japan",
        category: "Emulsifier",
    },
    {
        name: "Propylparaben",
        aliases: ["E217", "propyl paraben", "propyl 4-hydroxybenzoate"],
        risk: "Endocrine disruptor linked to hormone issues",
        euStatus: "Banned in EU food since 2006",
        category: "Preservative",
    },
    {
        name: "Red Dye No. 3",
        aliases: ["Red 3", "Erythrosine", "E127", "FD&C Red No. 3", "red #3"],
        risk: "Linked to thyroid tumors in animal studies",
        euStatus: "Banned in EU food products",
        category: "Colorant",
    },
    {
        name: "Azodicarbonamide",
        aliases: ["ADA", "azodicarbonamide", "E927a"],
        risk: "Respiratory sensitizer, linked to asthma",
        euStatus: "Banned in EU food (allowed in plastics)",
        category: "Flour Bleaching",
    },
    {
        name: "Red 40",
        aliases: ["Allura Red", "E129", "FD&C Red No. 40", "red #40", "CI 16035"],
        risk: "Hyperactivity in children, requires EU warning label",
        euStatus: "Requires warning label in EU",
        category: "Colorant",
    },
    {
        name: "Yellow 5",
        aliases: ["Tartrazine", "E102", "FD&C Yellow No. 5", "yellow #5", "CI 19140"],
        risk: "Hyperactivity in children, allergic reactions",
        euStatus: "Requires warning label in EU",
        category: "Colorant",
    },
    {
        name: "Yellow 6",
        aliases: ["Sunset Yellow", "E110", "FD&C Yellow No. 6", "yellow #6", "CI 15985"],
        risk: "Hyperactivity in children, allergic reactions",
        euStatus: "Requires warning label in EU",
        category: "Colorant",
    },
    {
        name: "Blue 1",
        aliases: ["Brilliant Blue", "E133", "FD&C Blue No. 1", "blue #1", "CI 42090"],
        risk: "Potential neurotoxicity concerns",
        euStatus: "Restricted use in EU",
        category: "Colorant",
    },
    {
        name: "BHA",
        aliases: ["Butylated Hydroxyanisole", "E320", "BHA"],
        risk: "Possible carcinogen, endocrine disruptor",
        euStatus: "Restricted in EU",
        category: "Preservative",
    },
    {
        name: "BHT",
        aliases: ["Butylated Hydroxytoluene", "E321", "BHT"],
        risk: "Possible carcinogen, liver effects",
        euStatus: "Restricted in EU",
        category: "Preservative",
    },
    {
        name: "TBHQ",
        aliases: ["tert-Butylhydroquinone", "TBHQ", "E319"],
        risk: "Potential carcinogen, vision problems at high doses",
        euStatus: "Restricted in EU",
        category: "Preservative",
    },
    {
        name: "Olestra",
        aliases: ["Olean", "olestra"],
        risk: "Digestive issues, blocks vitamin absorption",
        euStatus: "Banned in EU and Canada",
        category: "Fat Substitute",
    },
    {
        name: "rBGH/rBST",
        aliases: ["recombinant bovine growth hormone", "rBGH", "rBST", "bovine somatotropin"],
        risk: "Increased IGF-1 levels, antibiotic resistance concerns",
        euStatus: "Banned in EU since 1990",
        category: "Hormone",
    },
    {
        name: "Ractopamine",
        aliases: ["ractopamine", "Paylean", "Optaflexx"],
        risk: "Cardiovascular effects, banned in 160+ countries",
        euStatus: "Banned in EU since 1996",
        category: "Growth Promoter",
    },
    {
        name: "Arsenic-based drugs",
        aliases: ["roxarsone", "arsanilic acid", "arsenic"],
        risk: "Carcinogen, accumulates in meat",
        euStatus: "Never approved in EU",
        category: "Animal Drug",
    },
    {
        name: "Carrageenan",
        aliases: ["E407", "carrageenan", "Irish moss extract"],
        risk: "Inflammation concerns, digestive issues",
        euStatus: "Banned in EU infant formula",
        category: "Thickener",
    },
    {
        name: "Partially Hydrogenated Oils",
        aliases: ["PHO", "partially hydrogenated", "trans fat", "trans fats"],
        risk: "Trans fats increase heart disease risk",
        euStatus: "Strictly limited in EU (max 2%)",
        category: "Fat",
    },
    {
        name: "Sodium Nitrite",
        aliases: ["E250", "sodium nitrite", "nitrite"],
        risk: "Forms carcinogenic nitrosamines",
        euStatus: "Restricted levels in EU",
        category: "Preservative",
    },
];

// Function to analyze ingredients against the database
export function analyzeIngredients(ingredientText: string): {
    score: number;
    redFlags: {
        name: string;
        risk: string;
        euStatus: string;
        foundAs: string;
    }[];
    allIngredients: string[];
} {
    // Parse ingredients (common separators: comma, semicolon, parentheses)
    const cleanText = ingredientText
        .toLowerCase()
        .replace(/\([^)]*\)/g, (match) => `, ${match.slice(1, -1)},`) // Extract parentheses content
        .replace(/contains less than \d+% of:?/gi, ",")
        .replace(/contains:?/gi, ",")
        .replace(/ingredients:?/gi, ",");

    const ingredientList = cleanText
        .split(/[,;.]/)
        .map((i) => i.trim())
        .filter((i) => i.length > 1);

    const redFlags: {
        name: string;
        risk: string;
        euStatus: string;
        foundAs: string;
    }[] = [];

    const foundIngredientNames = new Set<string>();

    // Check each ingredient against banned list
    for (const ingredient of ingredientList) {
        for (const banned of BANNED_INGREDIENTS) {
            // Check if ingredient matches the banned item or any alias
            const allNames = [banned.name.toLowerCase(), ...banned.aliases.map((a) => a.toLowerCase())];

            for (const name of allNames) {
                if (ingredient.includes(name) || name.includes(ingredient)) {
                    if (!foundIngredientNames.has(banned.name)) {
                        foundIngredientNames.add(banned.name);
                        redFlags.push({
                            name: banned.name,
                            risk: banned.risk,
                            euStatus: banned.euStatus,
                            foundAs: ingredient,
                        });
                    }
                    break;
                }
            }
        }
    }

    // Calculate score (100 = safe, 0 = very problematic)
    const baseScore = 100;
    const deductionPerFlag = 15;
    const score = Math.max(0, baseScore - redFlags.length * deductionPerFlag);

    return {
        score,
        redFlags,
        allIngredients: ingredientList.filter((i) => i.length > 2),
    };
}
