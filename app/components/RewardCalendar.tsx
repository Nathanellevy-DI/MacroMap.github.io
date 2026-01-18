"use client";

import { useState } from "react";

interface RewardCalendarProps {
    history: Record<string, { consumed: number; water: number }>;
    budget: number;
    onDateSelect: (date: string) => void;
}

export default function RewardCalendar({ history, budget, onDateSelect }: RewardCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const getDayColor = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = history[dateStr];

        if (!dayData || dayData.consumed === 0) return 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500';

        const percentOfGoal = (dayData.consumed / budget) * 100;

        if (percentOfGoal <= 100) return 'bg-emerald-500 text-white'; // Perfect day
        if (percentOfGoal <= 120) return 'bg-yellow-500 text-white'; // Good day
        return 'bg-red-500 text-white'; // Over day
    };

    const isStreakDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const prevDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day - 1).padStart(2, '0')}`;
        const nextDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;

        return history[dateStr] && (history[prevDateStr] || history[nextDateStr]);
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isStreak = isStreakDay(day);
        const colorClass = getDayColor(day);

        days.push(
            <button
                key={day}
                onClick={() => onDateSelect(dateStr)}
                className={`h-10 rounded-lg ${colorClass} font-semibold text-sm hover:opacity-80 transition-all relative`}
            >
                {day}
                {isStreak && <span className="absolute top-0 right-0 text-yellow-300">⭐</span>}
            </button>
        );
    }

    // Calculate monthly stats
    const monthlyDays = Object.keys(history).filter(date => {
        const d = new Date(date);
        return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{monthNames[month]} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {days}
            </div>

            {/* Monthly summary */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Days logged this month</span>
                    <span className="font-bold text-emerald-500 dark:text-emerald-400">{monthlyDays} days</span>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-3 justify-center text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Perfect</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">Good</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Over</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-yellow-300">⭐</span>
                    <span className="text-gray-600 dark:text-gray-400">Streak</span>
                </div>
            </div>
        </div>
    );
}
