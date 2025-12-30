"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeState = {
  theme: Theme;
  accent: string;
  setTheme: (t: Theme) => void;
  setAccent: (a: string) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState("#22c55e");

  useEffect(() => {
    const t = localStorage.getItem("pm_theme") as Theme | null;
    const a = localStorage.getItem("pm_accent");
    if (t) setTheme(t);
    if (a) setAccent(a);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--accent", accent);
    localStorage.setItem("pm_theme", theme);
    localStorage.setItem("pm_accent", accent);
  }, [theme, accent]);

  return (
    <ThemeContext.Provider
      value={{ theme, accent, setTheme, setAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}
