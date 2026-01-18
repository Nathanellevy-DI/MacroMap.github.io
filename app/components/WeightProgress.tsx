"use client";

import { useEffect, useState } from "react";
import { getWeightProgress, getInitialWeight, getCurrentWeight } from "../lib/weight-tracker";

export default function WeightProgress({ currentWeight }: { currentWeight: number }) {
    const [progress, setProgress] = useState<{
        initial: number | null;
        current: number | null;
        change: number;
        unit: 'lbs' | 'kg';
        isLoss: boolean;
    } | null>(null);

    useEffect(() => {
        setProgress(getWeightProgress());
    }, [currentWeight]);

    if (!progress || !progress.initial) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚖️</span>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">Current Weight</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{currentWeight} lbs</div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">Log your weight to start tracking progress</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl p-5 border ${progress.isLoss
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">Weight Progress</h4>
                <span className="text-2xl">⚖️</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Start</div>
                    <div className="text-xl font-bold text-gray-600 dark:text-slate-300">{progress.initial}</div>
                    <div className="text-xs text-gray-400 dark:text-slate-500">{progress.unit}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Current</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-white">{progress.current}</div>
                    <div className="text-xs text-gray-400 dark:text-slate-500">{progress.unit}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">{progress.isLoss ? "Lost" : "Gained"}</div>
                    <div className={`text-xl font-bold ${progress.isLoss ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {progress.isLoss ? '-' : '+'}{Math.abs(progress.change)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-slate-500">{progress.unit}</div>
                </div>
            </div>
        </div>
    );
}
