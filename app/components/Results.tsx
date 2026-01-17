"use client";

interface RedFlag {
    name: string;
    risk: string;
    euStatus: string;
    foundAs: string;
}

interface ResultsProps {
    score: number;
    redFlags: RedFlag[];
    allIngredients: string[];
    onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score >= 70) return "#22c55e";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    const getLabel = () => {
        if (score >= 70) return "Safe";
        if (score >= 40) return "Caution";
        return "Risk";
    };

    return (
        <div className="relative w-40 h-40">
            <svg className="score-ring w-full h-full" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="10"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: getColor() }}>
                    {score}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{getLabel()}</span>
            </div>
        </div>
    );
}

export default function Results({ score, redFlags, allIngredients, onReset }: ResultsProps) {
    return (
        <div className="w-full max-w-lg mx-auto space-y-6 fade-in">
            {/* Score Section */}
            <div className="glass-card p-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-300">Safety Score</h2>
                <ScoreRing score={score} />
                <p className="text-sm text-gray-400 text-center max-w-xs">
                    {score >= 70
                        ? "This product appears to meet EU safety standards."
                        : score >= 40
                            ? "Some ingredients may need attention. Check the flags below."
                            : "This product contains ingredients banned in the EU."}
                </p>
            </div>

            {/* Red Flags */}
            {redFlags.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                        Red Flags ({redFlags.length})
                    </h3>
                    {redFlags.map((flag, index) => (
                        <div key={index} className="red-flag-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-red-400 text-lg">{flag.name}</h4>
                                <span className="text-xs px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 font-medium">
                                    {flag.euStatus}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{flag.risk}</p>
                            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-red-500/10">
                                Found as: <span className="text-gray-400 font-medium">&quot;{flag.foundAs}&quot;</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* All Clear */}
            {redFlags.length === 0 && (
                <div className="safe-card flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-400 text-lg">All Clear!</h4>
                        <p className="text-sm text-gray-400">No banned ingredients detected in this product.</p>
                    </div>
                </div>
            )}

            {/* All Ingredients */}
            {allIngredients.length > 0 && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">All Ingredients ({allIngredients.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {allIngredients.map((ingredient, index) => {
                            const isFlagged = redFlags.some(
                                (f) => ingredient.toLowerCase().includes(f.foundAs.toLowerCase())
                            );
                            return (
                                <span
                                    key={index}
                                    className={`ingredient-chip ${isFlagged ? 'flagged' : 'safe'}`}
                                >
                                    {isFlagged && (
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {ingredient}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reset Button */}
            <button onClick={onReset} className="btn-primary w-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyze Another Product
            </button>

            {/* Data Source */}
            <p className="text-xs text-center text-gray-600">
                Based on EU 2026 food safety regulations
            </p>
        </div>
    );
}
