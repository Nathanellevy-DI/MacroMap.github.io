"use client";

import { useState, useEffect } from "react";
import Scanner from "./components/Scanner";
import Results from "./components/Results";
import SettingsModal from "./components/SettingsModal";
import { AnalysisResult } from "./types";
import { analyzeImage, getApiKey } from "./lib/api";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getApiKey());
  }, [showSettings]);

  const handleCapture = async (imageData: string) => {
    const apiKey = getApiKey();

    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeImage(imageData, apiKey);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen p-6 pb-20">
      {/* Header */}
      <header className="text-center mb-8 relative">
        <button
          onClick={() => setShowSettings(true)}
          className="absolute right-0 top-0 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          title="Settings"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold gradient-text mb-2">MacroMap</h1>
        <p className="text-gray-400 text-sm">
          Scan ingredients • Compare US vs EU standards
        </p>

        {!hasApiKey && (
          <button
            onClick={() => setShowSettings(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors"
          >
            ⚠️ Add API Key to Enable Scanning
          </button>
        )}
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto">
        {!result ? (
          <>
            <Scanner onCapture={handleCapture} isLoading={isLoading} />

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Info Section */}
            <div className="mt-10 space-y-4">
              <h2 className="text-lg font-semibold text-center">
                What We Detect
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Titanium Dioxide", status: "Banned" },
                  { name: "Red Dye No. 3", status: "Banned" },
                  { name: "Potassium Bromate", status: "Banned" },
                  { name: "BVO", status: "Banned" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="glass-card p-3 text-center"
                  >
                    <p className="text-sm font-medium text-red-400">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.status} in EU</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Results result={result} onReset={handleReset} />
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-600 bg-gradient-to-t from-black to-transparent">
        <p>Data based on EU 2026 food safety regulations</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </main>
  );
}
