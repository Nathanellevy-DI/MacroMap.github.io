"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
    dark: boolean;
    toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    dark: false,
    toggle: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDark(true);
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);

    const toggle = () => {
        const newDark = !dark;
        setDark(newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
        if (newDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
        }
    };

    return (
        <ThemeContext.Provider value={{ dark, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
};
