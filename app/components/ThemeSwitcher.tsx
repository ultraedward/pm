"use client";

import { useTheme } from "./ThemeProvider";

const ACCENTS = ["#22c55e", "#3b82f6", "#a855f7", "#ef4444"];

export default function ThemeSwitcher() {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }
        className="text-sm text-gray-400 hover:text-white"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>

      <div className="flex items-center gap-2">
        {ACCENTS.map((c) => (
          <button
            key={c}
            onClick={() => setAccent(c)}
            style={{
              background: c,
              outline:
                c === accent
                  ? "2px solid white"
                  : "2px solid transparent",
            }}
            className="w-4 h-4 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
