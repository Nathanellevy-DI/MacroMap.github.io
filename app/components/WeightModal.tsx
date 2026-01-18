"use client";

import { useState, useEffect } from "react";
import { logWeight, getCurrentWeight } from "../lib/weight-tracker";

interface WeightModalProps {
    onClose: () => void;
    onLogWeight: (weight: number) => void;
    currentWeight?: number;
}

export default function WeightModal({ onClose, onLogWeight, currentWeight }: WeightModalProps) {
    const [weight, setWeight] = useState(currentWeight?.toString() || "");
    const [unit, setUnit] = useState<"lbs" | "kg">("lbs");

    // Load unit preference
    useEffect(() => {
        const saved = localStorage.getItem("weight_unit");
        if (saved === "kg") setUnit("kg");

        // Load current weight if available
        const current = getCurrentWeight();
        if (current && current.weight && !currentWeight) {
            setWeight(current.weight.toString());
        }
    }, [currentWeight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const w = parseFloat(weight);
        if (w > 0) {
            // Use the new weight tracker
            logWeight(w, unit);
            localStorage.setItem("weight_unit", unit);

            onLogWeight(w);
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Log Weight</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter weight"
                            className="flex-1 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-gray-800 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                            autoFocus
                        />
                        <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600">
                            <button
                                type="button"
                                onClick={() => setUnit("lbs")}
                                className={`px-4 py-3 font-semibold transition-colors ${unit === "lbs"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600"
                                    }`}
                            >
                                lbs
                            </button>
                            <button
                                type="button"
                                onClick={() => setUnit("kg")}
                                className={`px-4 py-3 font-semibold transition-colors ${unit === "kg"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600"
                                    }`}
                            >
                                kg
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!weight || parseFloat(weight) <= 0}
                        className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Save Weight
                    </button>
                </form>
            </div>
        </div>
    );
}
