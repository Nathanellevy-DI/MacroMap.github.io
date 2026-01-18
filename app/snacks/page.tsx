"use client";

import { useState } from "react";
import Link from "next/link";
import BarcodeScanner from "../components/BarcodeScanner";

export default function HealthySnacksPage() {
    const [activeTab, setActiveTab] = useState<"list" | "scan">("list");
    const [scannedItems, setScannedItems] = useState<string[]>([]);

    const handleScan = (code: string) => {
        if (!scannedItems.includes(code)) {
            setScannedItems(prev => [code, ...prev]);
            // In a real app, we'd fetch product data here
        }
    };

    const healthySnacks = [
        { id: 1, name: "Apple Slices with Almond Butter", cals: 180, protein: "4g" },
        { id: 2, name: "Greek Yogurt & Berries", cals: 140, protein: "12g" },
        { id: 3, name: "Hummus & Carrot Sticks", cals: 150, protein: "5g" },
        { id: 4, name: "Hard Boiled Eggs (2)", cals: 140, protein: "12g" },
        { id: 5, name: "Edamame", cals: 120, protein: "11g" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 pb-20">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold">Healthy Snacks</h1>
                    <div className="w-8" />
                </div>

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
                            <div key={snack.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{snack.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{snack.protein} Protein</p>
                                </div>
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm">
                                    {snack.cals} cal
                                </div>
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
