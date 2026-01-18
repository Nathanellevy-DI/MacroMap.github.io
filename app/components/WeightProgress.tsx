"use client";

import { useEffect, useState } from "react";
import { getWeightProgress, getWeightLogs, WeightLog } from "../lib/weight-tracker";

export default function WeightProgress({ currentWeight, onLogClick }: { currentWeight: number; onLogClick?: () => void }) {
    const [progress, setProgress] = useState<{
        initial: number | null;
        current: number | null;
        change: number;
        unit: 'lbs' | 'kg';
        isLoss: boolean;
    } | null>(null);
    const [logs, setLogs] = useState<WeightLog[]>([]);

    useEffect(() => {
        setProgress(getWeightProgress());
        setLogs(getWeightLogs());
    }, [currentWeight]);

    // Get last 7 weight entries for mini chart
    const chartData = logs.slice(-7);
    const minWeight = chartData.length > 0 ? Math.min(...chartData.map(l => l.weight)) - 2 : 0;
    const maxWeight = chartData.length > 0 ? Math.max(...chartData.map(l => l.weight)) + 2 : 100;
    const range = maxWeight - minWeight || 1;

    // Generate SVG path for weight line
    const generatePath = () => {
        if (chartData.length < 2) return "";
        const width = 280;
        const height = 80;
        const points = chartData.map((log, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - ((log.weight - minWeight) / range) * height;
            return `${x},${y}`;
        });
        return `M${points.join(' L')}`;
    };

    if (!progress || !progress.initial) {
        return (
            <div
                onClick={onLogClick}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 cursor-pointer hover:scale-[1.01] transition-transform"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚖️</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm text-gray-500 dark:text-slate-400">Current Weight</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{currentWeight} lbs</div>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        + Log
                    </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">Tap to log your weight and start tracking</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl p-5 border ${progress.isLoss
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    ⚖️ Weight Progress
                </h4>
                <button
                    onClick={onLogClick}
                    className="bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors"
                >
                    + Log Weight
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
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

            {/* Mini Chart */}
            {chartData.length >= 2 && (
                <div className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-3 mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
                        <span>Last {chartData.length} entries</span>
                        <span className={progress.isLoss ? 'text-emerald-600' : 'text-orange-600'}>
                            {progress.isLoss ? '↓ Trending Down' : '↑ Trending Up'}
                        </span>
                    </div>
                    <svg className="w-full h-20" viewBox="0 0 280 80" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="280" y2="20" stroke="currentColor" strokeOpacity="0.1" />
                        <line x1="0" y1="40" x2="280" y2="40" stroke="currentColor" strokeOpacity="0.1" />
                        <line x1="0" y1="60" x2="280" y2="60" stroke="currentColor" strokeOpacity="0.1" />

                        {/* Weight line */}
                        <path
                            d={generatePath()}
                            fill="none"
                            stroke={progress.isLoss ? "#10b981" : "#f59e0b"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {chartData.map((log, i) => {
                            const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 280 : 140;
                            const y = 80 - ((log.weight - minWeight) / range) * 80;
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill={progress.isLoss ? "#10b981" : "#f59e0b"}
                                />
                            );
                        })}
                    </svg>

                    {/* Weight labels */}
                    <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1">
                        {chartData.length > 0 && (
                            <>
                                <span>{chartData[0]?.weight}</span>
                                <span>{chartData[chartData.length - 1]?.weight}</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Log count */}
            <div className="text-center text-xs text-gray-400 dark:text-slate-500 mt-3">
                {logs.length} weight entries logged
            </div>
        </div>
    );
}
