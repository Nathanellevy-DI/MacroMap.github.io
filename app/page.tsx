"use client";

import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import Scanner from "./components/Scanner";
import MealBuilder from "./components/MealBuilder";
import QuickAdd from "./components/QuickAdd";
import MeSection from "./components/MeSection";
import InstallPrompt from "./components/InstallPrompt";
import WeeklyGraph from "./components/WeeklyGraph";
import NearbyRestaurants from "./components/NearbyRestaurants";
import RewardCalendar from "./components/RewardCalendar";
import ProgressDashboard from "./components/ProgressDashboard";
import WeeklyProgressChart from "./components/WeeklyProgressChart";
import WeightProgress from "./components/WeightProgress";
import StreakLevelCards from "./components/StreakLevelCards";
import AchievementPopup from "./components/AchievementPopup";
import { UserProgress, Achievement, calculateLevel, calculateStreak, checkNewAchievements } from "./lib/achievements";
import WeightModal from "./components/WeightModal";
import type { FoodItem } from "./types";

type NavTab = "dashboard" | "add" | "me";

// ...


export default function Home() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  // --- DATE & HISTORY STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock History Data
  const [history, setHistory] = useState<Record<string, { consumed: number, water: number }>>({});

  // Initialize or get history for current date
  const dateKey = currentDate.toISOString().split('T')[0];
  const todayData = history[dateKey] || { consumed: 0, water: 0 };
  const consumed = todayData.consumed;
  const waterIntake = todayData.water;

  // --- USER SETTINGS ---
  const [budget, setBudget] = useState(2500);
  const [trackingMode, setTrackingMode] = useState<"cut" | "maintain" | "bulk" | "no-tracking">("maintain");
  const [weight, setWeight] = useState(70);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [diet, setDiet] = useState<string | null>(null);
  const [enabledTools, setEnabledTools] = useState<string[]>(["meal-builder", "scanner", "my-diet"]);
  const [profileName, setProfileName] = useState("User");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [waterGoal, setWaterGoal] = useState(8);
  const [waterUnit, setWaterUnit] = useState<"glasses" | "oz" | "liters">("glasses");
  const [isLoaded, setIsLoaded] = useState(false);

  // --- REWARD SYSTEM STATE ---
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    totalMeals: 0,
    totalWater: 0,
    currentStreak: 0,
    longestStreak: 0,
    perfectDays: 0,
    snacksLogged: 0,
    daysAtGoal: 0,
    unlockedAchievements: [],
    lastLogDate: null
  });
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    // Load data from localStorage on mount
    const savedHistory = localStorage.getItem('macro_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error("Failed to parse history", e); }
    }

    const savedSettings = localStorage.getItem('macro_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.trackingMode) setTrackingMode(parsed.trackingMode);
        if (parsed.weight) setWeight(parsed.weight);
        if (parsed.diet) setDiet(parsed.diet);
        if (parsed.enabledTools) setEnabledTools(parsed.enabledTools);
        if (parsed.profileName) setProfileName(parsed.profileName);
        if (parsed.profilePicture) setProfilePicture(parsed.profilePicture);
        if (parsed.waterGoal) setWaterGoal(parsed.waterGoal);
        if (parsed.waterUnit) setWaterUnit(parsed.waterUnit);
      } catch (e) { console.error("Failed to parse settings", e); }
    }

    const savedProgress = localStorage.getItem('user_progress');
    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (e) { console.error("Failed to parse progress", e); }
    }

    setIsLoaded(true);
  }, []);

  // Update streaks when history changes
  useEffect(() => {
    if (isLoaded && Object.keys(history).length > 0) {
      const streaks = calculateStreak(history);
      setUserProgress((prev: UserProgress) => ({
        ...prev,
        currentStreak: streaks.current,
        longestStreak: Math.max(streaks.longest, prev.longestStreak),
        totalWater: Object.values(history).reduce((sum, day) => sum + day.water, 0)
      }));
    }
  }, [history, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('macro_history', JSON.stringify(history));
    }
  }, [history, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('macro_settings', JSON.stringify({
        budget,
        trackingMode,
        weight,
        diet,
        enabledTools,
        profileName,
        profilePicture,
        waterGoal,
        waterUnit
      }));
    }
  }, [budget, trackingMode, weight, diet, enabledTools, profileName, profilePicture, waterGoal, waterUnit, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('user_progress', JSON.stringify(userProgress));
    }
  }, [userProgress, isLoaded]);

  const updateHistory = (type: "consumed" | "water", value: number) => {
    setHistory(prev => {
      const current = prev[dateKey] || { consumed: 0, water: 0 };
      return {
        ...prev,
        [dateKey]: {
          ...current,
          [type]: type === "consumed" ? current.consumed + value : current.water + value
        }
      };
    });
  };

  const remaining = budget - consumed;
  const progress = Math.min((consumed / budget) * 100, 100);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleQuickAdd = (calories: number, type: string) => {
    if (type === "scan") {
      setSelectedTool("scanner");
    } else if (type === "fast-food" || type === "breakfast" || type === "lunch" || type === "dinner" || type === "snack") {
      setSelectedMealType(type);
      setSelectedTool("meal-builder");
    } else if (type === "weight") {
      setShowWeightModal(true);
    } else {
      updateHistory("consumed", calories);
    }
    setActiveTab("dashboard");
  };

  {/* Full Screen Tools */ }
  {
    selectedTool === "scanner" && (
      <div className="fixed inset-0 z-[100] bg-black">
        {/* Scanner is self-contained with onBack now, but we can wrap if needed */}
        <Scanner
          onBack={() => setSelectedTool(null)}
          onAnalyze={(foods) => { console.log(foods); setSelectedTool(null); }}
          isLoading={false}
        />
      </div>
    )
  }
  {
    selectedTool === "nearby" && (
      <div className="fixed inset-0 z-[100] bg-white">
        <div className="bg-white p-4 sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100">
          <button onClick={() => setSelectedTool(null)} className="p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="font-bold text-lg">Nearby Food</h2>
        </div>
        <NearbyRestaurants onSelectRestaurant={(r: any) => { console.log(r); setSelectedTool(null); }} />
      </div>
    )
  }
  {
    selectedTool === "meal-builder" && (
      <div className="fixed inset-0 z-[100] bg-white">
        <MealBuilder
          onBack={() => { setSelectedTool(null); setSelectedMealType(null); }}
          onLogMeal={(calories) => {
            updateHistory("consumed", calories);
            setSelectedTool(null);
            setSelectedMealType(null);
          }}
          mealType={selectedMealType}
        />
      </div>
    )
  }

  // Mock History Data (in real app, this would be DB)
  // const [history, setHistory] = useState<Record<string, { consumed: number, water: number }>>({}); // This is now defined above

  // Format Date Key (YYYY-MM-DD)
  // const dateKey = currentDate.toISOString().split('T')[0]; // This is now defined above

  // Get values for current date
  const dayData = history[dateKey] || { consumed: 0, water: 0 };
  // const consumed = dayData.consumed; // This is now defined above
  const water = dayData.water;

  // --- SETTINGS STATE ---
  // const [budget, setBudget] = useState(2000); // This is now defined above
  // const [trackingMode, setTrackingMode] = useState<"budget" | "tracking">("budget"); // This is now defined above
  // const [weight, setWeight] = useState(150); // This is now defined above
  // const [diet, setDiet] = useState("None"); // This is now defined above

  const caloriesLeft = Math.max(0, budget - consumed);
  const progressPercent = Math.min((consumed / budget) * 100, 100);

  // ... (existing code)

  // In render:
  {
    activeTab === "me" && (
      <MeSection
        budget={budget}
        setBudget={setBudget}
        trackingMode={trackingMode}
        setTrackingMode={setTrackingMode}
        weight={weight}
        setWeight={setWeight}
        diet={diet}
        setDiet={setDiet}
        enabledTools={enabledTools}
        setEnabledTools={setEnabledTools}
        profileName={profileName}
        setProfileName={setProfileName}
        profilePicture={profilePicture}
        setProfilePicture={setProfilePicture}
        waterGoal={waterGoal}
        setWaterGoal={setWaterGoal}
        waterUnit={waterUnit}
        setWaterUnit={setWaterUnit}
      />
    )
  }

  // Ring Calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // const handleDateChange = (days: number) => { // This is now defined above
  //   const newDate = new Date(currentDate);
  //   newDate.setDate(newDate.getDate() + days);
  //   setCurrentDate(newDate);
  // };

  // const updateHistory = (type: "consumed" | "water", value: number) => { // This is now defined above
  //   setHistory(prev => {
  //     const current = prev[dateKey] || { consumed: 0, water: 0 };
  //     return {
  //       ...prev,
  //       [dateKey]: {
  //         ...current,
  //         [type]: current[type] + value
  //       }
  //     };
  //   });
  // };

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-24 px-4 animate-in fade-in duration-500">
      {/* Date Header */}
      <div className="flex items-center justify-between py-2 bg-white sticky top-0 z-10 shadow-sm -mx-4 px-4">
        <button onClick={() => handleDateChange(-1)} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <button onClick={() => handleDateChange(1)} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Apple-Style Ring Card */}
      <div className="mx-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        {trackingMode !== "no-tracking" ? (
          // Reusing budget view for all modes for now, but label can change
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 font-medium capitalize">{trackingMode} Target</p>
              <p className="text-2xl font-bold text-gray-800">{budget}</p>
            </div>

            {/* Ring Visualization - FIXED: Icon embedded in SVG for perfect centering */}
            <div className="flex justify-center items-center w-full">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 280 280">
                  {/* Water Ring (Outer) */}
                  <g transform="rotate(-90 140 140)">
                    <circle cx="140" cy="140" r="130" stroke="#e0f2fe" strokeWidth="12" fill="none" />
                    <circle
                      cx="140"
                      cy="140"
                      r="130"
                      stroke="#0ea5e9"
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 130}
                      strokeDashoffset={2 * Math.PI * 130 - (Math.min(water, waterGoal) / waterGoal) * (2 * Math.PI * 130)}
                      style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                  </g>

                  {/* Calorie Ring (Inner) */}
                  <g transform="rotate(-90 140 140)">
                    <circle cx="140" cy="140" r={radius} stroke="#f1f5f9" strokeWidth="24" fill="none" />
                    {/* Progress Ring */}
                    <circle
                      cx="140"
                      cy="140"
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
                  {/* Icon Group - Perfectly centered relative to SVG coordinate space */}
                  <g transform="translate(128, 32)">
                    {/* 140 (center) - 12 (half icon width) = 128. Top margin 32. */}
                    <path className={progressPercent > 100 ? "text-red-500" : "text-emerald-500"} fill="currentColor" d="M17.7 20.2l-2.6.2c-1.6 0-3.3-1.1-4.7-2.5-1.4-1.4-2.5-3.1-2.5-4.7L8.1 10.6c-.2-.7-1.1-1-1.6-.6-.5.4-.6 1.1-.3 1.6l1.2 2.3c-.6.8-1.7.9-2.5.3-.8-.6-.9-1.7-.3-2.5l2.3-3.8c.4-.6.3-1.4-.4-1.8-.6-.3-1.3-.2-1.7.4L3.6 8.8c-.8.8-1.5 2.1-1.9 3.5-.3 1.2.2 2.4.9 3.6 1.1 1.9 3.1 3.2 5.3 3.5 2.2.3 4.4-.3 6.1-1.6l2.1 1.2c.5.3 1.2.1 1.5-.4.4-.6.2-1.3-.4-1.6z M13.8 2.2c-.5.4-.5 1.1-.1 1.6l1.6 2.1c.4.6 1.2.6 1.7.2.5-.4.5-1.2.1-1.7l-1.6-2.1c-.4-.5-1.2-.5-1.7-.1z" />
                  </g>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-bold text-gray-800">{caloriesLeft}</span>
                  <span className="text-sm text-gray-400 font-medium">left</span>
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

      {/* Water Tracker */}
      <div>
        <div className="bg-blue-500 rounded-3xl p-8 text-white shadow-lg shadow-blue-500/20 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 ml-2">Water</h3>
            <p className="text-blue-100 text-sm ml-2">Goal: {waterGoal} {waterUnit}</p>
          </div>
          <div className="flex items-center gap-4 mr-2">
            <button
              onClick={() => updateHistory("water", waterUnit === "liters" ? -0.1 : -1)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">{waterUnit === "liters" ? water.toFixed(1) : water}</span>
            <button
              onClick={() => updateHistory("water", waterUnit === "liters" ? 0.1 : 1)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 font-bold hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Reward System */}
      <div className="space-y-4 my-4">
        <StreakLevelCards
          currentStreak={userProgress.currentStreak}
          longestStreak={userProgress.longestStreak}
          progress={userProgress}
        />

        <ProgressDashboard progress={userProgress} />

        <WeightProgress currentWeight={weight} />

        <WeeklyProgressChart history={history} budget={budget} />

        <RewardCalendar
          history={history}
          budget={budget}
          onDateSelect={(date) => setCurrentDate(new Date(date))}
        />
      </div>

      {/* TOOLS MOVED TO DASHBOARD */}
      <div className="px-4 space-y-3">
        <h3 className="text-gray-700 font-semibold pl-1">Quick Tools</h3>

        {/* Meal Builder (AI Meal Scan) */}
        {enabledTools.includes("meal-builder") && (
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
        )}

        {/* Scanner (Restaurant Menu AI Scan) */}
        {enabledTools.includes("scanner") && (
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
        )}

        {/* My Diet (Restored) */}
        {enabledTools.includes("my-diet") && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">🔥</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">My Diet</h3>
              <p className="text-xs text-gray-500">Custom plan: Intermittent Fasting</p>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Graph (Replaces Advice) */}
      <div className="px-4">
        <WeeklyGraph />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pt-12 pb-24 px-6" style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}>
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
              updateHistory("consumed", calories);
              setSelectedTool(null);
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl shadow-gray-200/50 px-4">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "me" && (
          <MeSection
            budget={budget}
            setBudget={setBudget}
            trackingMode={trackingMode}
            setTrackingMode={setTrackingMode}
            weight={weight}
            setWeight={setWeight}
            diet={diet}
            setDiet={setDiet}
            enabledTools={enabledTools}
            setEnabledTools={setEnabledTools}
            profileName={profileName}
            setProfileName={setProfileName}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            waterGoal={waterGoal}
            setWaterGoal={setWaterGoal}
            waterUnit={waterUnit}
            setWaterUnit={setWaterUnit}
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

      <AchievementPopup
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {showWeightModal && (
        <WeightModal
          onClose={() => setShowWeightModal(false)}
          onLogWeight={(w) => setWeight(w)}
          currentWeight={weight}
        />
      )}

      <InstallPrompt />
    </main>
  );
}
