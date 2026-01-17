"use client";

import { UserProgress, ACHIEVEMENTS, getXPProgressInLevel } from "../lib/achievements";

interface ProgressDashboardProps {
    progress: UserProgress;
}

export default function ProgressDashboard({ progress }: ProgressDashboardProps) {
    const { current, needed } = getXPProgressInLevel(progress.xp, progress.level);
    const xpPercentage = (current / needed) * 100;

    const recentAchievements = progress.unlockedAchievements
        .slice(-3)
        .map(id => ACHIEVEMENTS.find(a => a.id === id))
        .filter(Boolean);

    return (
        <div className="space-y-4">
            {/* Level Progress */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">Level {progress.level} 🌟</h3>
                    <span className="text-sm opacity-90">{current}/{needed} XP</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${xpPercentage}%` }}
                    />
                </div>
                <p className="text-xs mt-2 opacity-75">{needed - current} XP until Level {progress.level + 1}</p>
            </div>

            {/* Stats Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-orange-600">{progress.currentStreak}</div>
                        <div className="text-xs text-gray-600 mt-1">🔥 Current Streak</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-emerald-600">{progress.longestStreak}</div>
                        <div className="text-xs text-gray-600 mt-1">🏆 Best Streak</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-blue-600">{progress.totalMeals}</div>
                        <div className="text-xs text-gray-600 mt-1">⭐ Total Meals</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4">
                        <div className="text-3xl font-bold text-violet-600">{Math.round((progress.totalWater / 8) * 100)}%</div>
                        <div className="text-xs text-gray-600 mt-1">💧 Hydration</div>
                    </div>
                </div>
            </div>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Achievements</h3>
                    <div className="space-y-3">
                        {recentAchievements.map((achievement) => achievement && (
                            <div
                                key={achievement.id}
                                className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200"
                            >
                                <span className="text-3xl">{achievement.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 text-sm">{achievement.name}</div>
                                    <div className="text-xs text-gray-500">{achievement.description}</div>
                                </div>
                                <div className="text-xs font-bold text-orange-600">+{achievement.xpReward} XP</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Achievements */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">All Achievements ({progress.unlockedAchievements.length}/{ACHIEVEMENTS.length})</h3>
                <div className="grid grid-cols-4 gap-3">
                    {ACHIEVEMENTS.map(achievement => {
                        const unlocked = progress.unlockedAchievements.includes(achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${unlocked
                                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300'
                                    : 'bg-gray-50 border border-gray-200 opacity-40'
                                    }`}
                                title={achievement.description}
                            >
                                <span className="text-2xl mb-1">{achievement.icon}</span>
                                <span className="text-[10px] text-center leading-tight text-gray-700 font-medium">
                                    {achievement.name.replace(/[🔥🌟⭐💎✅📅🥗💧🎯👑]/g, '').trim()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
