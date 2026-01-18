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
        <div className="w-full grid grid-cols-2 gap-3">
            {/* Streak Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-lg">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">Streak</span>
                        <span className="text-xl">🔥</span>
                    </div>

                    <div className="text-3xl font-black tracking-tight">
                        {currentStreak}
                    </div>
                    <div className="text-xs font-medium opacity-80">
                        {currentStreak === 1 ? "day" : "days"}
                    </div>

                    {longestStreak > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                            <div className="text-xs opacity-70">Best: {longestStreak} days</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Level Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">Level</span>
                        <span className="text-xl">⭐</span>
                    </div>

                    <div className="text-3xl font-black tracking-tight">
                        {progress.level}
                    </div>

                    <div className="mt-2">
                        <div className="flex justify-between text-xs opacity-80 mb-1">
                            <span>{current} XP</span>
                            <span>{needed} XP</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
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
