"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "default" | "blue" | "green" | "orange";

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>("default");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("themeColor") as ThemeColor;
    if (savedTheme) {
      setThemeColor(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    localStorage.setItem("themeColor", themeColor);
    const root = document.documentElement;
  
    root.removeAttribute("data-theme");

    if (themeColor !== "default") {
      root.setAttribute("data-theme", themeColor);
    }
  }, [themeColor, isMounted]);

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      <div style={{ visibility: isMounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (!context) throw new Error("useThemeColor harus digunakan di dalam ThemeColorProvider");
  return context;
}