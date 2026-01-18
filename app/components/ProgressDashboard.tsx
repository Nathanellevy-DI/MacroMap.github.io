"use client";

import { useState } from "react";
import { UserProgress, ACHIEVEMENTS, getXPProgressInLevel } from "../lib/achievements";

interface ProgressDashboardProps {
    progress: UserProgress;
}

export default function ProgressDashboard({ progress }: ProgressDashboardProps) {
    const { current, needed } = getXPProgressInLevel(progress.xp, progress.level);
    const xpPercentage = (current / needed) * 100;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

    const recentAchievements = progress.unlockedAchievements
        .slice(-3)
        .map(id => ACHIEVEMENTS.find(a => a.id === id))
        .filter(Boolean);

    const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
        const unlocked = progress.unlockedAchievements.includes(achievement.id);
        if (filter === "unlocked") return unlocked;
        if (filter === "locked") return !unlocked;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 px-2">Your Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-5 border border-orange-100 dark:border-orange-800/30">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 ml-1">{progress.currentStreak}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 mt-1 ml-1">🔥 Current Streak</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-100 dark:border-emerald-800/30">
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 ml-1">{progress.longestStreak}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 mt-1 ml-1">🏆 Best Streak</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/30">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 ml-1">{progress.totalMeals}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 mt-1 ml-1">⭐ Total Meals</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-violet-100 dark:border-purple-800/30">
                        <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 ml-1">{Math.round((progress.totalWater / 8) * 100)}%</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 mt-1 ml-1">💧 Hydration</div>
                    </div>
                </div>
            </div>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Recent Achievements</h3>
                    <div className="space-y-3">
                        {recentAchievements.map((achievement) => achievement && (
                            <div
                                key={achievement.id}
                                className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/30"
                            >
                                <span className="text-3xl">{achievement.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 dark:text-white text-sm">{achievement.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-slate-400">{achievement.description}</div>
                                </div>
                                <div className="text-xs font-bold text-orange-600 dark:text-orange-400">+{achievement.xpReward} XP</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Achievements */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white px-2">All Achievements ({progress.unlockedAchievements.length}/{ACHIEVEMENTS.length})</h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as "all" | "unlocked" | "locked")}
                            className="text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-gray-700 dark:text-slate-300 font-medium"
                        >
                            <option value="all">All</option>
                            <option value="unlocked">Unlocked</option>
                            <option value="locked">Locked</option>
                        </select>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <svg
                                className={`w-5 h-5 text-gray-600 dark:text-slate-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="grid grid-cols-4 gap-3">
                        {filteredAchievements.map(achievement => {
                            const unlocked = progress.unlockedAchievements.includes(achievement.id);
                            return (
                                <div
                                    key={achievement.id}
                                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${unlocked
                                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-600'
                                        : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 opacity-40'
                                        }`}
                                    title={achievement.description}
                                >
                                    <span className="text-2xl mb-1">{achievement.icon}</span>
                                    <span className="text-[10px] text-center leading-tight text-gray-700 dark:text-slate-300 font-medium">
                                        {achievement.name.replace(/[🔥🌟⭐💎✅📅🥗💧🎯👑]/g, '').trim()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
