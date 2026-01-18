"use client";

import { useState } from "react";
import Link from "next/link";
import BarcodeScanner from "../components/BarcodeScanner";

export default function HealthySnacksPage() {
    const [activeTab, setActiveTab] = useState<"list" | "scan">("list");
    const [scannedItems, setScannedItems] = useState<string[]>([]);
    const [loggedMessage, setLoggedMessage] = useState<string | null>(null);

    const handleScan = (code: string) => {
        if (!scannedItems.includes(code)) {
            setScannedItems(prev => [code, ...prev]);
        }
    };

    const logSnack = (name: string, calories: number) => {
        // Get current date key
        const dateKey = new Date().toISOString().split('T')[0];

        // Load existing history from localStorage
        const savedHistory = localStorage.getItem('macro_history');
        let history: Record<string, { consumed: number, water: number }> = {};

        if (savedHistory) {
            try {
                history = JSON.parse(savedHistory);
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }

        // Update history with new snack
        const current = history[dateKey] || { consumed: 0, water: 0 };
        history[dateKey] = {
            ...current,
            consumed: current.consumed + calories
        };

        // Save back to localStorage
        localStorage.setItem('macro_history', JSON.stringify(history));

        // Award XP for logging snack
        const savedProgress = localStorage.getItem('user_progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                progress.xp = (progress.xp || 0) + 10;
                progress.snacksLogged = (progress.snacksLogged || 0) + 1;
                localStorage.setItem('user_progress', JSON.stringify(progress));
            } catch (e) {
                console.error("Failed to update progress", e);
            }
        }

        // Show feedback
        setLoggedMessage(`✅ Logged ${name} (+${calories} cal, +10 XP)`);
        setTimeout(() => setLoggedMessage(null), 2500);
    };

    const healthySnacks = [
        { id: 1, name: "Apple Slices with Almond Butter", cals: 180, protein: "4g", emoji: "🍎" },
        { id: 2, name: "Greek Yogurt & Berries", cals: 140, protein: "12g", emoji: "🫐" },
        { id: 3, name: "Hummus & Carrot Sticks", cals: 150, protein: "5g", emoji: "🥕" },
        { id: 4, name: "Hard Boiled Eggs (2)", cals: 140, protein: "12g", emoji: "🥚" },
        { id: 5, name: "Edamame", cals: 120, protein: "11g", emoji: "🫛" },
        { id: 6, name: "Mixed Nuts (1oz)", cals: 170, protein: "5g", emoji: "🥜" },
        { id: 7, name: "Cottage Cheese & Pineapple", cals: 160, protein: "14g", emoji: "🍍" },
        { id: 8, name: "Rice Cakes with Avocado", cals: 130, protein: "2g", emoji: "🥑" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 pb-20">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold">🍎 Healthy Snacks</h1>
                    <div className="w-8" />
                </div>

                {/* Toast Message */}
                {loggedMessage && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-in slide-in-from-top duration-300">
                        {loggedMessage}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab("list")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "list"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                            }`}
                    >
                        Suggestions
                    </button>
                    <button
                        onClick={() => setActiveTab("scan")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "scan"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                            }`}
                    >
                        Scan Barcode
                    </button>
                </div>

                {activeTab === "list" ? (
                    <div className="space-y-3">
                        {healthySnacks.map(snack => (
                            <div key={snack.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                <div className="text-3xl">{snack.emoji}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{snack.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{snack.cals} cal • {snack.protein} Protein</p>
                                </div>
                                <button
                                    onClick={() => logSnack(snack.name, snack.cals)}
                                    className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
                                >
                                    + Log
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                            <h2 className="text-center font-semibold mb-4 text-slate-600 dark:text-slate-300">Scan Product Barcode</h2>
                            <BarcodeScanner onScan={handleScan} />
                        </div>

                        {scannedItems.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-slate-600 dark:text-slate-400 ml-1">Recent Scans</h3>
                                {scannedItems.map((code, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between">
                                        <span className="font-mono text-sm">{code}</span>
                                        <span className="text-xs text-slate-400">Just now</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
