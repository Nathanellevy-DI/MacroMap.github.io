"use client";

import { useState, useEffect } from "react";
import Scanner from "./components/Scanner";
import Results from "./components/Results";
import MealBuilder from "./components/MealBuilder";
import { analyzeIngredients } from "./lib/ingredients-db";

type AppMode = "home" | "scanner" | "results" | "meal-builder";
type Theme = "dark" | "light";

interface AnalysisResult {
  score: number;
  redFlags: {
    name: string;
    risk: string;
    euStatus: string;
    foundAs: string;
  }[];
  allIngredients: string[];
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>("home");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Handle theme
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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </main>
    );
  }

  // Meal Builder
  if (mode === "meal-builder") {
    return (
      <main className="min-h-screen px-4 py-6">
        <MealBuilder onBack={() => setMode("home")} />
      </main>
    );
  }

  // Results
  if (mode === "results" && result) {
    return (
      <main className="min-h-screen px-4 py-6 safe-area-top safe-area-bottom">
        <Results
          score={result.score}
          redFlags={result.redFlags}
          allIngredients={result.allIngredients}
          onReset={handleReset}
        />
      </main>
    );
  }

  // Home
  return (
    <main className="min-h-screen px-4 py-6 safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="max-w-lg mx-auto mb-8 fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MacroMap</h1>
              <p className="text-xs text-gray-500">Food Intelligence</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
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
        </div>
      </header>

      {/* Feature Cards */}
      <div className="max-w-lg mx-auto space-y-4">
        {/* Meal Builder - Primary */}
        <button
          onClick={() => setMode("meal-builder")}
          className="w-full glass-card p-5 text-left hover:scale-[1.01] transition-transform fade-in"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Track Your Meal</h3>
              <p className="text-sm text-gray-400 mb-3">
                Search foods, scan barcodes, or add from restaurants
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">🔍 Search</span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">🍔 Restaurants</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-400">🥩 Custom</span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Ingredient Scanner */}
        <button
          onClick={() => setMode("scanner")}
          className="w-full glass-card p-5 text-left hover:scale-[1.01] transition-transform fade-in fade-in-delay-1"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Ingredient Scanner</h3>
              <p className="text-sm text-gray-400 mb-3">
                Check for EU-banned additives in your food
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-400">Red Flags</span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">EU vs US</span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Stats Preview */}
        <div className="glass-card p-5 fade-in fade-in-delay-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-400">Data Sources</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">10</div>
              <div className="text-xs text-gray-500">Restaurants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">35+</div>
              <div className="text-xs text-gray-500">Whole Foods</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">20</div>
              <div className="text-xs text-gray-500">EU Banned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Overlay */}
      {mode === "scanner" && (
        <div className="fixed inset-0 bg-black/95 z-40 overflow-auto">
          <div className="min-h-screen px-4 py-6 safe-area-top safe-area-bottom">
            <div className="max-w-lg mx-auto">
              <button onClick={() => setMode("home")} className="icon-btn mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-xl font-bold gradient-text text-center mb-2">Ingredient Scanner</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                Paste ingredients to check for <span className="text-red-400">banned</span> substances
              </p>

              <Scanner onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center text-xs text-gray-600 bg-gradient-to-t from-black via-black/80 to-transparent safe-area-bottom">
        <p>No API key needed • Open Food Facts</p>
      </footer>
    </main>
  );
}
