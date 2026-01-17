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
