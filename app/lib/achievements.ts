// Achievement and XP tracking system

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    category: 'streak' | 'total' | 'perfect' | 'special';
    xpReward: number;
}

export interface UserProgress {
    level: number;
    xp: number;
    totalMeals: number;
    totalWater: number;
    currentStreak: number;
    longestStreak: number;
    perfectDays: number;
    snacksLogged: number;
    daysAtGoal: number;
    unlockedAchievements: string[];
    lastLogDate: string | null;
}

export const ACHIEVEMENTS: Achievement[] = [
    // Streak Badges
    { id: 'streak_3', name: '🔥 Starter', description: '3 day streak', icon: '🔥', requirement: 3, category: 'streak', xpReward: 50 },
    { id: 'streak_7', name: '🔥🔥 Committed', description: '7 day streak', icon: '🔥🔥', requirement: 7, category: 'streak', xpReward: 100 },
    { id: 'streak_30', name: '🔥🔥🔥 Dedicated', description: '30 day streak', icon: '🔥🔥🔥', requirement: 30, category: 'streak', xpReward: 500 },
    { id: 'streak_100', name: '👑 Legend', description: '100 day streak', icon: '👑', requirement: 100, category: 'streak', xpReward: 2000 },

    // Total Logs
    { id: 'meals_10', name: '🌟 Beginner', description: '10 meals logged', icon: '🌟', requirement: 10, category: 'total', xpReward: 50 },
    { id: 'meals_50', name: '⭐ Regular', description: '50 meals logged', icon: '⭐', requirement: 50, category: 'total', xpReward: 200 },
    { id: 'meals_100', name: '🌟🌟 Expert', description: '100 meals logged', icon: '🌟🌟', requirement: 100, category: 'total', xpReward: 500 },
    { id: 'meals_500', name: '💎 Master', description: '500 meals logged', icon: '💎', requirement: 500, category: 'total', xpReward: 2500 },

    // Perfect Weeks/Months
    { id: 'perfect_week', name: '✅ Week Warrior', description: '7 consecutive days logged', icon: '✅', requirement: 7, category: 'perfect', xpReward: 150 },
    { id: 'perfect_month', name: '📅 Month Champion', description: '30 consecutive days logged', icon: '📅', requirement: 30, category: 'perfect', xpReward: 1000 },

    // Special
    { id: 'snacks_10', name: '🥗 Health Conscious', description: '10 snacks logged', icon: '🥗', requirement: 10, category: 'special', xpReward: 100 },
    { id: 'water_100', name: '💧 Hydration Hero', description: '100 glasses of water', icon: '💧', requirement: 100, category: 'special', xpReward: 300 },
    { id: 'goal_10', name: '🎯 Goal Keeper', description: '10 days at calorie goal', icon: '🎯', requirement: 10, category: 'special', xpReward: 200 },
];

export function calculateLevel(xp: number): number {
    let level = 1;
    let requiredXP = 100;
    let totalXP = 0;

    while (totalXP + requiredXP <= xp) {
        totalXP += requiredXP;
        level++;
        requiredXP = level <= 10 ? 100 : 200;
    }

    return level;
}

export function getXPForNextLevel(currentLevel: number): number {
    return currentLevel < 10 ? 100 : 200;
}

export function getXPProgressInLevel(xp: number, level: number): { current: number; needed: number } {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
        totalXP += i <= 10 ? 100 : 200;
    }

    const needed = getXPForNextLevel(level);
    const current = xp - totalXP;

    return { current, needed };
}

export function checkNewAchievements(progress: UserProgress): Achievement[] {
    const newAchievements: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
        if (progress.unlockedAchievements.includes(achievement.id)) {
            continue;
        }

        let requirement = 0;
        switch (achievement.category) {
            case 'streak':
                requirement = progress.currentStreak;
                break;
            case 'total':
                requirement = progress.totalMeals;
                break;
            case 'perfect':
                requirement = progress.currentStreak;
                break;
            case 'special':
                if (achievement.id.startsWith('snacks')) requirement = progress.snacksLogged;
                if (achievement.id.startsWith('water')) requirement = progress.totalWater;
                if (achievement.id.startsWith('goal')) requirement = progress.daysAtGoal;
                break;
        }

        if (requirement >= achievement.requirement) {
            newAchievements.push(achievement);
        }
    }

    return newAchievements;
}

export function calculateStreak(history: Record<string, { consumed: number; water: number }>): { current: number; longest: number } {
    const dates = Object.keys(history).sort().reverse();

    if (dates.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if user logged today or yesterday for current streak
    if (dates[0] === today || dates[0] === yesterday) {
        currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);

        if (diffDays === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
}
