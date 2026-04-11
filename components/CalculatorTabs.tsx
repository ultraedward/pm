"use client";

import { useState } from "react";
import Link from "next/link";
import { QuickCalculator } from "@/components/QuickCalculator";
import { GramCalculator } from "@/components/GramCalculator";

type Metal = "gold" | "silver" | "platinum" | "palladium";

type Props = {
  spots: Record<Metal, number>;
};

const TABS = [
  { id: "oz",   label: "Coins & bars",     sub: "By troy oz"      },
  { id: "gram", label: "Jewelry & scrap",  sub: "By weight & karat" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CalculatorTabs({ spots }: Props) {
  const [tab, setTab] = useState<TabId>("oz");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div
        className="flex rounded-xl border overflow-hidden w-fit mx-auto"
        style={{ borderColor: "var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-2.5 text-sm font-semibold transition-colors flex flex-col items-center gap-0.5 ${
              tab === t.id
                ? "bg-amber-500/15 text-amber-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] font-normal opacity-70">{t.sub}</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      {tab === "oz" && <QuickCalculator spots={spots} />}
      {tab === "gram" && (
        <div className="space-y-3">
          <GramCalculator spots={{ gold: spots.gold, silver: spots.silver }} />
          <p className="text-center text-xs text-gray-600">
            Want karat reference tables and a shareable link?{" "}
            <Link href="/gram" className="text-amber-500 hover:text-amber-400 transition-colors">
              Open full calculator →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
