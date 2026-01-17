"use client";

import { useState } from "react";

interface ScannerProps {
    onAnalyze: (text: string) => void;
    isLoading: boolean;
}

export default function Scanner({ onAnalyze, isLoading }: ScannerProps) {
    const [ingredientText, setIngredientText] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleAnalyze = () => {
        if (ingredientText.trim()) {
            onAnalyze(ingredientText);
        }
    };

    const sampleIngredients = `Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Potassium Bromate, Red 40, Yellow 5, Titanium Dioxide, BHA, Sodium Benzoate`;

    const handleTrySample = () => {
        setIngredientText(sampleIngredients);
        setShowInput(true);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {!showInput ? (
                <>
                    <div className="camera-container gradient-border">
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center float">
                                <svg
                                    className="w-12 h-12 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-300 font-medium mb-1">
                                    Paste Ingredient List
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Copy ingredients from a food label
                                </p>
                            </div>
                        </div>
                        <div className="camera-overlay"></div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm">
                        <button
                            onClick={() => setShowInput(true)}
                            className="btn-primary pulse-glow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Enter Ingredients
                        </button>

                        <button
                            onClick={handleTrySample}
                            className="btn-secondary text-sm"
                        >
                            Try Sample (with Red Flags)
                        </button>
                    </div>
                </>
            ) : (
                <div className="w-full max-w-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-gray-400">Ingredient List</h3>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setIngredientText("");
                            }}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    <textarea
                        value={ingredientText}
                        onChange={(e) => setIngredientText(e.target.value)}
                        placeholder="Paste or type the ingredient list here...

Example: Water, Sugar, Corn Syrup, Red 40, Yellow 5..."
                        rows={8}
                        autoFocus
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-500 resize-none text-sm leading-relaxed"
                    />

                    <p className="text-xs text-gray-500 text-center">
                        We&apos;ll check for ingredients banned or restricted in the EU
                    </p>

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !ingredientText.trim()}
                        className="btn-primary w-full"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Analyze Ingredients
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* No API Note */}
            <p className="text-xs text-center text-gray-600 mt-4">
                ✓ No API key required • Instant local analysis
            </p>
        </div>
    );
}
