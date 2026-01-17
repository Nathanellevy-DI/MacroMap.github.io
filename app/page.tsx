"use client";

import { useState, useEffect } from "react";
import Scanner from "./components/Scanner";
import Results from "./components/Results";
import MealBuilder from "./components/MealBuilder";
import InstallPrompt from "./components/InstallPrompt";
import { analyzeIngredients } from "./lib/ingredients-db";
import { getAllRestaurantCount } from "./lib/restaurants";

type AppMode = "home" | "scanner" | "results" | "meal-builder";
type Theme = "dark" | "light";

interface AnalysisResult {
  score: number;
  redFlags: { name: string; risk: string; euStatus: string; foundAs: string }[];
  allIngredients: string[];
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>("home");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("macromap-theme") as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("macromap-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleAnalyze = (text: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const analysis = analyzeIngredients(text);
      setResult({
        score: analysis.score,
        redFlags: analysis.redFlags,
        allIngredients: analysis.allIngredients,
      });
      setMode("results");
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setResult(null);
    setMode("home");
  };

  const stats = getAllRestaurantCount();

  if (!mounted) {
    return (
      <main className="min-h-screen flex-center">
        <div className="spinner" />
      </main>
    );
  }

  if (mode === "meal-builder") {
    return (
      <main className="min-h-screen">
        <MealBuilder onBack={() => setMode("home")} />
      </main>
    );
  }

  if (mode === "results" && result) {
    return (
      <main className="min-h-screen container safe-top safe-bottom py-6">
        <Results
          score={result.score}
          redFlags={result.redFlags}
          allIngredients={result.allIngredients}
          onReset={handleReset}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen safe-top safe-bottom">
      <div className="container py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex-center shadow-lg shadow-emerald-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-title gradient-text">MacroMap</h1>
              <p className="text-caption text-gray-500">Track what you eat</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-10 fade-in">
          <h2 className="text-display mb-3">
            Know What<br />
            <span className="gradient-text">You&apos;re Eating</span>
          </h2>
          <p className="text-body text-gray-400 max-w-sm mx-auto">
            Track macros from restaurants, scan barcodes, or log your meals with ease.
          </p>
        </section>

        {/* Main Action Cards */}
        <div className="space-y-4 mb-8">
          {/* Meal Builder - Primary */}
          <button
            onClick={() => setMode("meal-builder")}
            className="w-full glass-card card-interactive p-6 text-left fade-in"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-center shadow-lg shadow-emerald-500/25 shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading mb-1">Build Your Meal</h3>
                <p className="text-small text-gray-400 mb-4">
                  Search foods, restaurants, or scan barcodes
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="macro-chip protein">🔍 Search</span>
                  <span className="macro-chip fat">🍔 {stats.restaurants} Restaurants</span>
                  <span className="macro-chip carbs">📷 Barcode</span>
                </div>
              </div>
              <svg className="w-6 h-6 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Ingredient Scanner */}
          <button
            onClick={() => setMode("scanner")}
            className="w-full glass-card card-interactive p-6 text-left fade-in fade-in-delay-1"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex-center shrink-0">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading mb-1">Ingredient Scanner</h3>
                <p className="text-small text-gray-400 mb-4">
                  Check for EU-banned additives in your food
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold">🚩 Red Flags</span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">🌍 EU vs US</span>
                </div>
              </div>
              <svg className="w-6 h-6 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Stats Card */}
        <div className="glass-card p-6 fade-in fade-in-delay-2">
          <h4 className="text-small text-gray-400 mb-4 text-center">Available Data</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stats.restaurants}</div>
              <div className="text-caption text-gray-500">Restaurants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.items}+</div>
              <div className="text-caption text-gray-500">Menu Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">80+</div>
              <div className="text-caption text-gray-500">Whole Foods</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center fade-in fade-in-delay-3">
          <p className="text-caption text-gray-600">
            No API key needed • Open Food Facts • Free forever
          </p>
        </footer>
      </div>

      {/* Scanner Overlay */}
      {mode === "scanner" && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
          <div className="container safe-top safe-bottom py-6">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setMode("home")} className="icon-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-title gradient-text">Ingredient Scanner</h2>
            </div>
            <Scanner onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Install Prompt */}
      <InstallPrompt />
    </main>
  );
}
