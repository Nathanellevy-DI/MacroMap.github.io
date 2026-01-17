"use client";

import { useState } from "react";

interface ScannerProps {
    onAnalyze: (foods: string[]) => void;
    isLoading: boolean;
    onBack?: () => void;
    onScan?: (data: any) => void;
}

export default function Scanner({ onAnalyze, isLoading, onBack }: ScannerProps) {
    const [ingredientText, setIngredientText] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleAnalyze = () => {
        if (ingredientText.trim()) {
            setIsScanning(true);
            setTimeout(() => {
                // Fix: Pass array of strings, split by comma or just pass single item as array
                onAnalyze(ingredientText.split(",").map(i => i.trim()).filter(Boolean));
                setIsScanning(false);
            }, 1200);
        }
    };

    const sampleIngredients = `Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Potassium Bromate, Red 40, Yellow 5, Titanium Dioxide, BHA, Sodium Benzoate`;

    const handleTrySample = () => {
        setIngredientText(sampleIngredients);
        setShowInput(true);
    };

    if (isScanning) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] relative scanner-active text-gray-800">
                <div className="w-64 h-64 relative">
                    <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-4 border-2 border-emerald-400/50 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-emerald-500 font-mono text-lg animate-pulse font-bold">ANALYZING</div>
                    </div>
                </div>
                {/* Dark scanner line might need adjustment for light bg, or keep it as a 'laser' */}
                <div className="scanner-line top-1/2" />
                <p className="mt-8 text-gray-500 font-mono text-sm">Matching against EU bans...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-[60vh] relative text-gray-800">
            {!showInput ? (
                <>
                    {/* Visual Target Area */}
                    <div className="flex-1 flex flex-col justify-center items-center py-10">
                        <div className="relative w-64 h-64 mx-auto mb-8">
                            {/* HUD Elements - Update color for light mode */}
                            <div className="absolute inset-0 border border-gray-200 rounded-3xl" />
                            <div className="scanner-corner tl !border-gray-300" />
                            <div className="scanner-corner tr !border-gray-300" />
                            <div className="scanner-corner bl !border-gray-300" />
                            <div className="scanner-corner br !border-gray-300" />

                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                                    <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className="scanner-line" style={{ animationDuration: '3s' }} />
                        </div>

                        <div className="text-center space-y-2 max-w-xs mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800">Ingredient Scanner</h2>
                            <p className="text-gray-500 text-sm">
                                Check for EU-banned additives and hidden health risks
                            </p>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-auto w-full space-y-3 pb-4">
                        <button
                            onClick={() => setShowInput(true)}
                            className="btn-primary w-full h-14 text-lg shadow-lg shadow-emerald-500/20"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Paste Ingredients
                        </button>

                        <button
                            onClick={handleTrySample}
                            className="btn-ghost w-full text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                            Try Demo Analysis
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pt-4">
                        <h3 className="font-semibold text-gray-800">New Analysis</h3>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setIngredientText("");
                            }}
                            className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1 relative mb-4 group">
                        <textarea
                            value={ingredientText}
                            onChange={(e) => setIngredientText(e.target.value)}
                            placeholder="Paste ingredients here..."
                            className="relative w-full h-full p-5 bg-white rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:outline-none text-base text-gray-800 placeholder-gray-400 resize-none font-sans leading-relaxed shadow-sm"
                            autoFocus
                        />
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-3 pb-4">
                        <div className="flex items-center gap-3 px-1">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500">
                                Instant AI analysis against EU safety standards
                            </p>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !ingredientText.trim()}
                            className="btn-primary w-full h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Analyzing..." : "Analyze Now"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
