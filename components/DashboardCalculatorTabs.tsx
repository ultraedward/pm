"use client";

import { useState } from "react";
import { MeltCalculator } from "@/components/MeltCalculator";
import { GramCalculator } from "@/components/GramCalculator";

type Metal = "gold" | "silver" | "platinum" | "palladium";

type Props = {
  spots: Record<Metal, number>;
  isPro: boolean;
};

const TABS = [
  { id: "coins", label: "Coins & bars",    sub: "By coin type"      },
  { id: "gram",  label: "Jewelry & scrap", sub: "By weight & karat" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DashboardCalculatorTabs({ spots, isPro }: Props) {
  const [tab, setTab] = useState<TabId>("coins");

  return (
    <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}>
      <div>
        <p className="text-xs text-gray-600 font-medium uppercase tracking-widest mb-1">Calculators</p>
        <p className="text-sm text-gray-500">Value your stack, coins, jewelry, or scrap at today&apos;s spot prices.</p>
      </div>

      {/* Tab bar */}
      <div
        className="flex rounded-xl border overflow-hidden w-fit"
        style={{ borderColor: "var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors flex flex-col items-center gap-0.5 ${
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

      {tab === "coins" && <MeltCalculator spots={spots} isPro={isPro} />}
      {tab === "gram"  && <GramCalculator spots={{ gold: spots.gold, silver: spots.silver }} />}
    </div>
  );
}
