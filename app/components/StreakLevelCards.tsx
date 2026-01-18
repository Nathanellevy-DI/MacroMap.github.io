"use client";

import { UserProgress, getXPProgressInLevel } from "../lib/achievements";

interface StreakLevelCardsProps {
    currentStreak: number;
    longestStreak: number;
    progress: UserProgress;
}

export default function StreakLevelCards({ currentStreak, longestStreak, progress }: StreakLevelCardsProps) {
    const { current, needed } = getXPProgressInLevel(progress.xp, progress.level);
    const xpPercentage = Math.min((current / needed) * 100, 100);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-xl shadow-orange-500/25">
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">Streak</span>
                        <span className="text-2xl">🔥</span>
                    </div>

                    <div className="text-4xl font-black tracking-tight">
                        {currentStreak}
                    </div>
                    <div className="text-sm font-medium opacity-80 mt-1">
                        {currentStreak === 1 ? "day" : "days"}
                    </div>

                    {longestStreak > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                            <div className="text-xs opacity-70">Best: {longestStreak} days</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Level Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/25">
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">Level</span>
                        <span className="text-2xl">⭐</span>
                    </div>

                    <div className="text-4xl font-black tracking-tight">
                        {progress.level}
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-between text-xs opacity-80 mb-1">
                            <span>{current} XP</span>
                            <span>{needed} XP</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${xpPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
