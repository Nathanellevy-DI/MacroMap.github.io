"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface WeeklyProgressChartProps {
    history: Record<string, { consumed: number; water: number }>;
    budget: number;
}

export default function WeeklyProgressChart({ history, budget }: WeeklyProgressChartProps) {
    const chartData = useMemo(() => {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split("T")[0];
            const dayData = history[dateKey] || { consumed: 0, water: 0 };

            data.push({
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                calories: dayData.consumed,
                goal: budget,
                water: dayData.water,
            });
        }

        return data;
    }, [history, budget]);

    const totalCalories = chartData.reduce((sum, day) => sum + day.calories, 0);
    const avgCalories = Math.round(totalCalories / 7);
    const daysOnTrack = chartData.filter(day => day.calories <= budget && day.calories > 0).length;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Weekly Progress</h3>
                <div className="flex gap-3">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Avg/Day</div>
                        <div className="text-sm font-bold text-gray-800">{avgCalories} cal</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">On Track</div>
                        <div className="text-sm font-bold text-emerald-600">{daysOnTrack}/7 days</div>
                    </div>
                </div>
            </div>

            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            domain={[0, 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#fff'
                            }}
                            formatter={(value) => [`${value} cal`, 'Calories']}
                        />
                        <Area
                            type="monotone"
                            dataKey="calories"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCalories)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Goal line indicator */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Calories Consumed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5 bg-gray-300" />
                    <span>Daily Goal: {budget}</span>
                </div>
            </div>
        </div>
    );
}
