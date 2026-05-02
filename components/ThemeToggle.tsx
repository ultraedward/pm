"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const current = document.documentElement.getAttribute("data-theme");
    setTheme((stored || current || "dark") as "dark" | "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  }

  // Render a neutral placeholder until mounted (avoids hydration mismatch)
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="flex items-center justify-center w-8 h-8 opacity-0"
      />
    );
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex items-center justify-center w-8 h-8 rounded-none transition-opacity hover:opacity-60"
      style={{ color: "var(--text-muted)" }}
      title={isLight ? "Dark mode" : "Light mode"}
    >
      {isLight ? (
        /* Moon — minimal, geometric */
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 10.5A6.5 6.5 0 1 1 5.5 2a5 5 0 0 0 8.5 8.5z"
            fill="currentColor"
          />
        </svg>
      ) : (
        /* Sun — clean, athletic */
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
          <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      )}
    </button>
  );
}
