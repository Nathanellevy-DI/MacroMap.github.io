"use client";

import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import Scanner from "./components/Scanner";
import MealBuilder from "./components/MealBuilder";
import QuickAdd from "./components/QuickAdd";
import MeSection from "./components/MeSection";
import InstallPrompt from "./components/InstallPrompt";
import WeeklyGraph from "./components/WeeklyGraph";

type NavTab = "dashboard" | "add" | "me";


export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // Using string to be flexible
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // --- DYNAMIC DASHBOARD STATE ---
  // --- DYNAMIC DASHBOARD STATE ---
  // Default: New User State (2000 goal, 0 consumed)
  const [budget, setBudget] = useState(2000);
  const [consumed, setConsumed] = useState(0);
  const [trackingMode, setTrackingMode] = useState<"budget" | "tracking">("budget");

  const caloriesLeft = Math.max(0, budget - consumed);
  const progressPercent = Math.min((consumed / budget) * 100, 100);

  // Ring Calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleQuickAdd = (calories: number, type: string) => {
    if (type === "scan") {
      setSelectedTool("scanner");
    } else if (type === "fast-food") {
      setSelectedTool("meal-builder");
      // Ideally we'd pass a prop to open the "Restaurant" tab directly, 
      // but MealBuilder defaults to Search. We can leave as is for now or improve later.
    } else {
      setConsumed(prev => prev + calories);
    }
    // Switch or stay on dashboard
    setActiveTab("dashboard");
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
        {trackingMode === "budget" ? (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 font-medium">Calorie Budget</p>
              <p className="text-2xl font-bold text-gray-800">{budget}</p>
            </div>

            {/* Ring Visualization */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Background Ring */}
                <svg className="w-full h-full" viewBox="0 0 256 256">
                  <g transform="rotate(-90 128 128)">
                    <circle cx="128" cy="128" r={radius} stroke="#f1f5f9" strokeWidth="24" fill="none" />
                    {/* Progress Ring */}
                    <circle
                      cx="128"
                      cy="128"
                      r={radius}
                      stroke={progressPercent > 100 ? "#ef4444" : "#22c55e"}
                      strokeWidth="24"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease" }}
                    />
                  </g>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-bold text-gray-800">{caloriesLeft}</span>
                  <span className="text-sm text-gray-400 font-medium">left</span>
                </div>

                {/* Decorative Icon - Centred at Top INSIDE the ring */}
                <div className={`absolute top-10 left-1/2 -translate-x-1/2 ${progressPercent > 100 ? "text-red-500" : "text-emerald-500"} transform pointer-events-none`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.7 20.2l-2.6.2c-1.6 0-3.3-1.1-4.7-2.5-1.4-1.4-2.5-3.1-2.5-4.7L8.1 10.6c-.2-.7-1.1-1-1.6-.6-.5.4-.6 1.1-.3 1.6l1.2 2.3c-.6.8-1.7.9-2.5.3-.8-.6-.9-1.7-.3-2.5l2.3-3.8c.4-.6.3-1.4-.4-1.8-.6-.3-1.3-.2-1.7.4L3.6 8.8c-.8.8-1.5 2.1-1.9 3.5-.3 1.2.2 2.4.9 3.6 1.1 1.9 3.1 3.2 5.3 3.5 2.2.3 4.4-.3 6.1-1.6l2.1 1.2c.5.3 1.2.1 1.5-.4.4-.6.2-1.3-.4-1.6z M13.8 2.2c-.5.4-.5 1.1-.1 1.6l1.6 2.1c.4.6 1.2.6 1.7.2.5-.4.5-1.2.1-1.7l-1.6-2.1c-.4-.5-1.2-.5-1.7-.1z" /></svg>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400 mb-2">{consumed} calories eaten</p>
              <button onClick={() => setActiveTab("add")} className="text-emerald-500 font-semibold text-sm hover:underline">Log a Meal</button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 font-medium mb-2">Total Calories</p>
            <p className="text-6xl font-black text-gray-800 tracking-tight">{consumed}</p>
            <p className="text-emerald-500 font-medium mt-2">Just Tracking</p>
            <button onClick={() => setActiveTab("add")} className="mt-8 bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
              Log Calories
            </button>
          </div>
        )}
      </div>

      {/* TOOLS MOVED TO DASHBOARD */}
      <div className="px-4 space-y-3">
        <h3 className="text-gray-700 font-semibold pl-1">Quick Tools</h3>

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

        {/* My Diet (Restored) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">🔥</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">My Diet</h3>
            <p className="text-xs text-gray-500">Custom plan: Intermittent Fasting</p>
          </div>
        </div>
      </div>

      {/* Weekly Graph (Replaces Advice) */}
      <div className="px-4">
        <WeeklyGraph />
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
          <MealBuilder
            onBack={() => setSelectedTool(null)}
            onLogMeal={(calories) => {
              setConsumed(prev => prev + calories);
              setSelectedTool(null);
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl shadow-gray-200/50">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "me" && (
          <MeSection
            budget={budget}
            setBudget={setBudget}
            trackingMode={trackingMode}
            setTrackingMode={setTrackingMode}
          />
        )}
      </div>

      {/* QUICK ADD OVERLAY */}
      {activeTab === "add" && (
        <QuickAdd
          onClose={() => setActiveTab("dashboard")} // Close goes back to dash
          onAddCalories={handleQuickAdd}
        />
      )}

      {/* @ts-ignore - BottomNav types might need relaxation if we strictly check "tools" vs "dashboard" */}
      <BottomNav activeTab={activeTab as any} onTabChange={(tab) => setActiveTab(tab)} />
      <InstallPrompt />
    </main>
  );
}
