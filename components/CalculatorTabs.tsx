"use client";

import { useState } from "react";
import { QuickCalculator } from "@/components/QuickCalculator";
import { GramCalculator } from "@/components/GramCalculator";

type Metal = "gold" | "silver" | "platinum" | "palladium";

type Props = {
  spots: Record<Metal, number>;
  goldSpot: number;
};

const TABS = [
  { id: "oz",   label: "By troy oz",       sub: "Coins & bars"   },
  { id: "gram", label: "By weight",         sub: "Jewelry & scrap" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CalculatorTabs({ spots, goldSpot }: Props) {
  const [tab, setTab] = useState<TabId>("oz");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div
        className="flex rounded-xl border overflow-hidden w-fit mx-auto"
        style={{ borderColor: "rgba(212,175,55,0.15)" }}
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
      {tab === "oz"   && <QuickCalculator spots={spots} />}
      {tab === "gram" && <GramCalculator goldSpot={goldSpot} />}
    </div>
  );
}
