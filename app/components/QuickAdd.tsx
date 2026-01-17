"use client";

import { useState } from "react";

interface QuickAddProps {
    onClose: () => void;
    onAddCalories: (calories: number, mealType: string) => void;
}

export default function QuickAdd({ onClose, onAddCalories }: QuickAddProps) {
    const [calories, setCalories] = useState("");

    const handleQuickSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cal = parseInt(calories);
        if (cal > 0) {
            onAddCalories(cal, "Quick Add");
            onClose();
        }
    };

    const mealTypes = [
        { id: "breakfast", label: "Breakfast", icon: "🍳", bg: "bg-orange-100", text: "text-orange-600" },
        { id: "lunch", label: "Lunch", icon: "🥗", bg: "bg-emerald-100", text: "text-emerald-600" },
        { id: "dinner", label: "Dinner", icon: "🍖", bg: "bg-blue-100", text: "text-blue-600" },
        { id: "snack", label: "Snack", icon: "🍎", bg: "bg-purple-100", text: "text-purple-600" },
        { id: "water", label: "Water", icon: "💧", bg: "bg-cyan-100", text: "text-cyan-600" },
        { id: "weight", label: "Weight", icon: "⚖️", bg: "bg-gray-100", text: "text-gray-600" },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end sm:justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300" onClick={(e) => e.stopPropagation()}>

                {/* Handle for mobile feeling */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Quick Add</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Grid Options */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* NEW: Scan Item */}
                    <button
                        onClick={() => { onAddCalories(0, "scan"); onClose(); }}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                            📷
                        </div>
                        <span className="text-xs font-medium text-gray-600">Scan Item</span>
                    </button>

                    {/* NEW: Fast Food */}
                    <button
                        onClick={() => { onAddCalories(0, "fast-food"); onClose(); }}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                            🍔
                        </div>
                        <span className="text-xs font-medium text-gray-600">Fast Food</span>
                    </button>

                    {/* Existing Meal Types */}
                    {mealTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                if (type.id !== 'water' && type.id !== 'weight') {
                                    onAddCalories(0, type.id);
                                    onClose();
                                }
                                // Handle water/weight later if needed or via separate logic
                                if (type.id === 'water') {
                                    onAddCalories(0, 'water');
                                    onClose();
                                }
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95"
                        >
                            <div className={`w-14 h-14 ${type.bg} ${type.text} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                                {type.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-600">{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* Fast Track Input */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Fast Track Calories</label>
                    <form onSubmit={handleQuickSubmit} className="flex gap-3">
                        <input
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="0"
                            className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:border-emerald-500 focus:outline-none transition-colors"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!calories}
                            className="bg-emerald-500 text-white px-6 rounded-xl font-bold font-lg shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
