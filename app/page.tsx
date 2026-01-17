"use client";

import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import Scanner from "./components/Scanner";
import MealBuilder from "./components/MealBuilder";
import InstallPrompt from "./components/InstallPrompt";

type NavTab = "dashboard" | "tools" | "add" | "community" | "me";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("tools"); // Default to Tools to show changes
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // --- MOCK DATA FOR DASHBOARD ---
  const caloriesLeft = 1454;
  const caloriesBudget = 1454;

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Date Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 z-10 shadow-sm">
        <button className="text-emerald-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Today
        </div>
        <button className="text-emerald-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Apple-Style Ring Card */}
      <div className="mx-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 font-medium">Calorie Budget</p>
          <p className="text-2xl font-bold text-gray-800">{caloriesBudget}</p>
        </div>

        {/* Ring Visualization */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Background Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="110" stroke="#f1f5f9" strokeWidth="24" fill="none" />
            {/* Progress (Apple Shape) implementation would go here, simplified for now */}
            <path d="M128 18 A 110 110 0 0 1 238 128" stroke="#ef4444" strokeWidth="24" strokeLinecap="round" fill="none" />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{caloriesLeft}</span>
            <span className="text-sm text-gray-400 font-medium">left</span>
          </div>

          {/* Apple Icon Mock */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-red-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.7 20.2l-2.6.2c-1.6 0-3.3-1.1-4.7-2.5-1.4-1.4-2.5-3.1-2.5-4.7L8.1 10.6c-.2-.7-1.1-1-1.6-.6-.5.4-.6 1.1-.3 1.6l1.2 2.3c-.6.8-1.7.9-2.5.3-.8-.6-.9-1.7-.3-2.5l2.3-3.8c.4-.6.3-1.4-.4-1.8-.6-.3-1.3-.2-1.7.4L3.6 8.8c-.8.8-1.5 2.1-1.9 3.5-.3 1.2.2 2.4.9 3.6 1.1 1.9 3.1 3.2 5.3 3.5 2.2.3 4.4-.3 6.1-1.6l2.1 1.2c.5.3 1.2.1 1.5-.4.4-.6.2-1.3-.4-1.6z M13.8 2.2c-.5.4-.5 1.1-.1 1.6l1.6 2.1c.4.6 1.2.6 1.7.2.5-.4.5-1.2.1-1.7l-1.6-2.1c-.4-.5-1.2-.5-1.7-.1z" /></svg>
          </div>
        </div>

        <div className="text-center mt-6">
          <button className="text-emerald-500 font-semibold text-sm">View All Meals</button>
        </div>
      </div>

      {/* Daily Advice Cards */}
      <div className="px-4">
        <h3 className="text-gray-700 font-semibold mb-3">My Daily Advice</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[140px] h-[160px] bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex flex-col justify-between">
              <p className="text-sm font-semibold text-emerald-900">Review Your Plan</p>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                🍏
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-emerald-500 pt-safe-top pb-6 px-4 text-white shadow-lg shadow-emerald-500/20 rounded-b-[2.5rem] mb-6">
        <div className="flex items-center justify-between mb-2">
          <button className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <span className="font-semibold text-lg">Diet Tools</span>
          <button className="px-4 py-1 bg-orange-400 rounded-full text-xs font-bold shadow-sm">Go Premium</button>
        </div>
      </div>

      {/* Tools List */}
      <div className="px-4 space-y-3">
        {/* My Diet */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">🔥</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">My Diet</h3>
            <p className="text-xs text-gray-500">Find a diet that fits your lifestyle</p>
          </div>
          <button className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full">Select</button>
        </div>

        {/* Premium Recipes */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">👨‍🍳</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Premium Recipes & Meals</h3>
            <p className="text-xs text-gray-500">Crafted by our Registered Dietitians</p>
          </div>
        </div>

        {/* Meal Builder (AI Meal Scan) */}
        <div
          onClick={() => handleToolClick("meal-builder")}
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">🥬</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Meal Builder</h3>
            <p className="text-xs text-gray-500">Build meals from restaurants & foods</p>
          </div>
        </div>

        {/* Scanner (Restaurant Menu AI Scan) */}
        <div
          onClick={() => handleToolClick("scanner")}
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">📷</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Ingredient Scanner</h3>
            <p className="text-xs text-gray-500">Check for bans & red flags</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="mt-8 mx-4 h-40 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-1">Keto<br />Recipes</h3>
          <button className="text-xs font-bold flex items-center gap-1 mt-2">BROWSE <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        </div>
        <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80" className="absolute right-0 top-0 bottom-0 w-1/2 object-cover opacity-80 mask-image-gradient" alt="Food" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Full Screen Overlays for Tools */}
      {selectedTool === "scanner" && (
        <div className="fixed inset-0 z-[100] bg-black">
          <div className="absolute top-4 left-4 z-50">
            <button onClick={() => setSelectedTool(null)} className="p-2 bg-black/50 rounded-full text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <Scanner onAnalyze={() => { }} isLoading={false} />
        </div>
      )}

      {selectedTool === "meal-builder" && (
        <div className="fixed inset-0 z-[100] bg-white">
          <MealBuilder onBack={() => setSelectedTool(null)} />
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "tools" && renderTools()}

      {activeTab === "add" && (
        <div className="flex items-center justify-center min-h-screen pb-20">
          <p className="text-gray-400">Quick Add Menu (Coming Soon)</p>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <InstallPrompt />
    </main>
  );
}
