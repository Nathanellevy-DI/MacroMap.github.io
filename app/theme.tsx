"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSettings, saveSettings } from "./lib/store";

interface ThemeContextType {
  dark: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  dark: true,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    const isDark = settings.darkMode;
    setDark(isDark);
    applyTheme(isDark);
    setMounted(true);
  }, []);

  function applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    applyTheme(newDark);
    const settings = getSettings();
    saveSettings({ ...settings, darkMode: newDark });
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
