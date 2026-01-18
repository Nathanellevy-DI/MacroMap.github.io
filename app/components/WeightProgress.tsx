"use client";

import { useMemo, useEffect, useState } from "react";

interface WeightProgressProps {
    currentWeight: number;
}

interface WeightEntry {
    weight: number;
    unit: "lbs" | "kg";
}

export default function WeightProgress({ currentWeight }: WeightProgressProps) {
    const [startingWeight, setStartingWeight] = useState<number | null>(null);
    const [unit, setUnit] = useState<"lbs" | "kg">("lbs");

    useEffect(() => {
        // Get weight history to find starting weight
        const history = JSON.parse(localStorage.getItem("weight_history") || "{}");
        const savedUnit = localStorage.getItem("weight_unit") as "lbs" | "kg" | null;

        if (savedUnit) setUnit(savedUnit);

        // Find the earliest weight entry
        const dates = Object.keys(history).sort();
        if (dates.length > 0) {
            const firstEntry = history[dates[0]] as WeightEntry;
            setStartingWeight(firstEntry.weight);
        }
    }, [currentWeight]);

    const weightChange = startingWeight
        ? Math.round((startingWeight - currentWeight) * 10) / 10
        : 0;

    const isLoss = weightChange > 0;

    if (!startingWeight) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xl">⚖️</span>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Current Weight</div>
                        <div className="text-xl font-bold text-gray-800">{currentWeight} {unit}</div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Log your weight to track progress</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl p-5 ${isLoss ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Weight Progress</h4>
                <span className="text-2xl">⚖️</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-xs text-gray-500 mb-1">Start</div>
                    <div className="text-lg font-bold text-gray-600">{startingWeight}</div>
                    <div className="text-xs text-gray-400">{unit}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 mb-1">Current</div>
                    <div className="text-lg font-bold text-gray-800">{currentWeight}</div>
                    <div className="text-xs text-gray-400">{unit}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 mb-1">{isLoss ? "Lost" : "Gained"}</div>
                    <div className={`text-lg font-bold ${isLoss ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {isLoss ? '-' : '+'}{Math.abs(weightChange)}
                    </div>
                    <div className="text-xs text-gray-400">{unit}</div>
                </div>
            </div>
        </div>
    );
}
