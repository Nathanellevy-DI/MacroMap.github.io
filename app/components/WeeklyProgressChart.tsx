"use client";

import { useMemo, useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceLine
} from "recharts";
import { getWeightLogs } from "../lib/weight-tracker";

interface WeeklyProgressChartProps {
    history: Record<string, { consumed: number; weight?: number }>;
    budget: number;
}

export default function WeeklyProgressChart({ history, budget }: WeeklyProgressChartProps) {
    const [weights, setWeights] = useState<Record<string, number>>({});

    useEffect(() => {
        // load weights from local storage via helper
        const logs = getWeightLogs();
        const map: Record<string, number> = {};
        logs.forEach(l => {
            map[l.date] = l.weight;
        });
        setWeights(map);
    }, []);

    // Transform history object to sorted array for chart
    const data = useMemo(() => {
        // Get last 7 days including today
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split("T")[0]);
        }

        return dates.map(date => {
            const entry = history[date];
            return {
                day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                fullDate: date,
                calories: entry ? entry.consumed : 0,
                weight: weights[date] || null // Use loaded weight data
            };
        });
    }, [history, weights]);

    // If no data, show empty state (optional), but graph handles 0s fine
    if (Object.keys(history).length === 0 && Object.keys(weights).length === 0) {
        // We still show the empty grid for the last 7 days
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-white/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Weekly Progress</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Calories & Weight Trend</p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="calories"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#10b981' }}
                        />
                        <YAxis
                            yAxisId="weight"
                            orientation="right"
                            domain={['auto', 'auto']}
                            hide={false} // Show weight axis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#3b82f6' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <ReferenceLine y={budget} yAxisId="calories" stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />

                        <Line
                            yAxisId="calories"
                            type="monotone"
                            dataKey="calories"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                        {/* Render weight line if data exists */}
                        <Line
                            yAxisId="weight"
                            type="monotone"
                            dataKey="weight"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3, fill: '#3b82f6' }}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
