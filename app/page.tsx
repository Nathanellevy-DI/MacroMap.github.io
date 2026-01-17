"use client";

import { useState } from "react";
import Scanner from "./components/Scanner";
import Results from "./components/Results";
import MealBuilder from "./components/MealBuilder";
import { analyzeIngredients } from "./lib/ingredients-db";

type AppMode = "home" | "scanner" | "results" | "meal-builder";

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

  const handleAnalyze = (text: string) => {
    setIsLoading(true);

    // Use local database - instant analysis, no API needed
    setTimeout(() => {
      const analysis = analyzeIngredients(text);
      setResult({
        score: analysis.score,
        redFlags: analysis.redFlags,
        allIngredients: analysis.allIngredients,
      });
      setMode("results");
      setIsLoading(false);
    }, 500); // Small delay for UX
  };

  const handleReset = () => {
    setResult(null);
    setMode("home");
  };

  // Meal Builder mode
  if (mode === "meal-builder") {
    return (
      <main className="min-h-screen px-4 py-8 pb-24">
        <MealBuilder onBack={() => setMode("home")} />
      </main>
    );
  }

  // Results mode
  if (mode === "results" && result) {
    return (
      <main className="min-h-screen px-4 py-8 pb-24">
        <Results
          score={result.score}
          redFlags={result.redFlags}
          allIngredients={result.allIngredients}
          onReset={handleReset}
        />
      </main>
    );
  }

  // Home / Scanner mode
  return (
    <main className="min-h-screen px-4 py-8 pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto mb-10 fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">MacroMap</h1>
            <p className="text-xs text-gray-500">Food Intelligence</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm text-center">
          Check ingredients & track macros<br />
          <span className="text-emerald-400">No API key required</span>
        </p>
      </header>

      {/* Feature Cards */}
      <div className="max-w-lg mx-auto space-y-4 fade-in fade-in-delay-1">
        {/* Ingredient Scanner Card */}
        <button
          onClick={() => setMode("scanner")}
          className="w-full glass-card p-6 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Ingredient Scanner</h3>
              <p className="text-sm text-gray-400">
                Detect ingredients banned in the EU but allowed in the US
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                  Red Flags
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                  EU vs US
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  No API
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Meal Builder Card */}
        <button
          onClick={() => setMode("meal-builder")}
          className="w-full glass-card p-6 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Meal Builder</h3>
              <p className="text-sm text-gray-400">
                Track macros by searching foods from Open Food Facts
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  Protein
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  Carbs
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                  Fat
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Scanner Mode Overlay */}
      {mode === "scanner" && (
        <div className="fixed inset-0 bg-black/95 z-40 overflow-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-lg mx-auto">
              <button
                onClick={() => setMode("home")}
                className="icon-btn mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-xl font-bold gradient-text text-center mb-2">Ingredient Scanner</h2>
              <p className="text-gray-400 text-sm text-center mb-8">
                Paste ingredients to check for <span className="text-red-400">EU-banned</span> substances
              </p>

              <Scanner onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-xs text-gray-600 bg-gradient-to-t from-black via-black/80 to-transparent">
        <p>EU 2026 data • Open Food Facts • No API key needed</p>
      </footer>
    </main>
  );
}
