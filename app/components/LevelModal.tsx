"use client";

import { useState } from "react";
import { UserProgress, getXPProgressInLevel, ACHIEVEMENTS } from "../lib/achievements";

interface LevelModalProps {
    progress: UserProgress;
    onClose: () => void;
}

export default function LevelModal({ progress, onClose }: LevelModalProps) {
    const [showHelp, setShowHelp] = useState(false);
    const { current, needed } = getXPProgressInLevel(progress.xp, progress.level);
    const percent = Math.min((current / needed) * 100, 100);

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with ? button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        Level Progress
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showHelp
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                                }`}
                        >
                            ?
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {showHelp ? (
                    // Help View
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                            <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2">How to gain XP</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                    <span className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm">🍽️</span>
                                    <span>Log a meal (+10 XP)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                    <span className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm">💧</span>
                                    <span>Hit water goal (+20 XP)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                    <span className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm">🎯</span>
                                    <span>Hit calorie goal (+50 XP)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                    <span className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm">🔥</span>
                                    <span>Maintain streak (+10 XP/day)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                    <span className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm">🏆</span>
                                    <span>Unlock Achievements (+Bonus XP)</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setShowHelp(false)}
                            className="w-full py-3 bg-gray-100 dark:bg-slate-700 rounded-xl font-semibold text-gray-600 dark:text-slate-300"
                        >
                            Back to Stats
                        </button>
                    </div>
                ) : (
                    // Stats View
                    <div className="space-y-6">
                        {/* Current Level Large Display */}
                        <div className="text-center py-4">
                            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                                {progress.level}
                            </div>
                            <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">Current Level</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-violet-600 dark:text-violet-400">{current} XP</span>
                                <span className="text-gray-400">{needed} XP Needed</span>
                            </div>
                            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-2">
                                {needed - current} XP to reach Level {progress.level + 1}
                            </p>
                        </div>

                        {/* Level Unlock Preview (Mock) */}
                        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 opacity-60">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-xl">
                                    🔒
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Level {progress.level + 1} Rewards</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">New profile badge & features</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
