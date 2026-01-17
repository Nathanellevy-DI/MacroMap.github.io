"use client";

interface StreakRewardsProps {
    currentStreak: number;
    longestStreak: number;
}

export default function StreakRewards({ currentStreak, longestStreak }: StreakRewardsProps) {
    const getNextMilestone = () => {
        const milestones = [3, 7, 30, 100];
        return milestones.find(m => m > currentStreak) || 100;
    };

    const nextMilestone = getNextMilestone();
    const progressToNext = (currentStreak / nextMilestone) * 100;

    const getFlameSize = () => {
        if (currentStreak >= 100) return "text-6xl";
        if (currentStreak >= 30) return "text-5xl";
        if (currentStreak >= 7) return "text-4xl";
        return "text-3xl";
    };

    const getFlameCount = () => {
        if (currentStreak >= 100) return "🔥🔥🔥🔥";
        if (currentStreak >= 30) return "🔥🔥🔥";
        if (currentStreak >= 7) return "🔥🔥";
        if (currentStreak >= 3) return "🔥";
        return "🔥";
    };

    if (currentStreak === 0) {
        return (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-6 text-center">
                <div className="text-4xl mb-2 grayscale opacity-50">🔥</div>
                <h3 className="font-bold text-gray-600 mb-1">Start Your Streak!</h3>
                <p className="text-sm text-gray-500">Log your meals daily to build a streak</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-lg">
            <div className="text-center mb-4">
                <div className={`${getFlameSize()} mb-2 animate-pulse`}>
                    {getFlameCount()}
                </div>
                <h3 className="font-bold text-2xl">{currentStreak} Day Streak!</h3>
                <p className="text-sm opacity-90 mt-1">Keep it going!</p>
            </div>

            {currentStreak < 100 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span>Next reward: {nextMilestone} days</span>
                        <span>{nextMilestone - currentStreak} to go</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${progressToNext}%` }}
                        />
                    </div>
                </div>
            )}

            {currentStreak >= 100 && (
                <div className="mt-4 text-center">
                    <div className="text-4xl mb-2">👑</div>
                    <p className="text-sm font-semibold">LEGENDARY STATUS!</p>
                </div>
            )}

            {longestStreak > currentStreak && (
                <div className="mt-4 pt-4 border-t border-white/20 text-center text-xs opacity-75">
                    🏆 Your best: {longestStreak} days
                </div>
            )}
        </div>
    );
}
