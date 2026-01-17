"use client";

import { useState } from "react";

export default function WeeklyGraph() {
    // Mock data for weekly progress
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const values = [1800, 2100, 1950, 1600, 2000, 2400, 1300]; // Last one connects to today
    const goal = 2000;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-6">Weekly Progress</h3>

            <div className="flex items-end justify-between h-32 gap-2">
                {values.map((val, i) => {
                    const percent = Math.min((val / 2500) * 100, 100);
                    const isOver = val > goal;
                    const isToday = i === 6; // Mocking today as Sunday

                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                            {/* Bar container */}
                            <div className="w-full bg-gray-50 rounded-full h-full relative overflow-hidden flex items-end justify-center">
                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-1000 ${isToday
                                            ? (isOver ? "bg-red-400" : "bg-emerald-500")
                                            : (isOver ? "bg-red-200" : "bg-emerald-200")
                                        }`}
                                    style={{ height: `${percent}%` }}
                                />
                                {/* User goal line (optional visual, maybe too complex for simple CSS?) */}
                            </div>
                            <span className={`text-xs font-medium ${isToday ? "text-gray-800" : "text-gray-400"}`}>
                                {days[i]}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>On Track</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span>Over Budget</span>
                </div>
            </div>
        </div>
    );
}
