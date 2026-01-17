"use client";

import { AnalysisResult } from "../types";

interface ResultsProps {
    result: AnalysisResult;
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

    return (
        <div className="relative w-36 h-36">
            <svg className="score-ring w-full h-full" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="8"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: getColor() }}>
                    {score}
                </span>
                <span className="text-xs text-gray-400">Safety Score</span>
            </div>
        </div>
    );
}

export default function Results({ result, onReset }: ResultsProps) {
    const { score, red_flags, reformulation_note, all_ingredients } = result;

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            {/* Score Section */}
            <div className="glass-card p-6 flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold">Precautionary Score</h2>
                <ScoreRing score={score} />
                <p className="text-sm text-gray-400 text-center">
                    {score >= 70
                        ? "This product meets EU safety standards."
                        : score >= 40
                            ? "Some ingredients may be problematic."
                            : "Contains ingredients banned in the EU."}
                </p>
            </div>

            {/* Red Flags */}
            {red_flags.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Red Flags ({red_flags.length})
                    </h3>
                    {red_flags.map((flag, index) => (
                        <div key={index} className="red-flag-card">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-red-400">{flag.name}</h4>
                                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                                    {flag.eu_status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{flag.risk}</p>
                            {flag.alias && (
                                <p className="text-xs text-gray-500">
                                    Also known as: <span className="text-gray-400">{flag.alias}</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* All Clear */}
            {red_flags.length === 0 && (
                <div className="safe-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-400">All Clear!</h4>
                        <p className="text-sm text-gray-400">No banned ingredients detected.</p>
                    </div>
                </div>
            )}

            {/* Reformulation Note */}
            {reformulation_note && (
                <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        EU Reformulation
                    </h3>
                    <p className="text-sm text-gray-300">{reformulation_note}</p>
                </div>
            )}

            {/* All Ingredients */}
            <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">All Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                    {all_ingredients.map((ingredient, index) => {
                        const isFlagged = red_flags.some(
                            (f) => f.name.toLowerCase() === ingredient.toLowerCase()
                        );
                        return (
                            <span
                                key={index}
                                className={`text-xs px-2 py-1 rounded-full ${isFlagged
                                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                        : "bg-gray-800 text-gray-400"
                                    }`}
                            >
                                {ingredient}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Reset Button */}
            <button onClick={onReset} className="btn-primary w-full justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Scan Another Product
            </button>
        </div>
    );
}
