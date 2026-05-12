"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QuickCalculator } from "@/components/QuickCalculator";
import { GramCalculator } from "@/components/GramCalculator";

type Metal = "gold" | "silver" | "platinum" | "palladium";

type Props = {
  spots: Record<Metal, number>;
};

const TABS = [
  { id: "oz",   label: "Coins & bars",     sub: "By troy oz"        },
  { id: "gram", label: "Jewelry & scrap",  sub: "By weight & karat" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CalculatorTabs({ spots }: Props) {
  const [tab, setTab] = useState<TabId>("oz");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow-key navigation between tabs (ARIA tabs keyboard pattern)
  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    const count = TABS.length;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % count;
      setTab(TABS[next].id);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + count) % count;
      setTab(TABS[prev].id);
      tabRefs.current[prev]?.focus();
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab list — role="tablist" establishes the ARIA tabs widget */}
      <div
        role="tablist"
        aria-label="Calculator type"
        className="flex border overflow-hidden w-fit"
        style={{ borderColor: "var(--border-strong)" }}
      >
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`calc-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`calc-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`px-6 py-3 transition-colors flex flex-col items-start gap-0.5 ${
              tab === t.id ? "" : "hover:text-gray-300"
            }`}
            style={{
              color:       tab === t.id ? "var(--text)" : undefined,
              background:  tab === t.id ? "var(--surface-2)" : "transparent",
              borderRight: "1px solid var(--border)",
            }}
          >
            <span className="label" style={{ color: tab === t.id ? "var(--text)" : undefined }}>{t.label}</span>
            <span className="text-[9px] tracking-wide uppercase" style={{ color: "var(--text-dim)" }}>{t.sub}</span>
          </button>
        ))}
      </div>

      {/* Tab panels — tabIndex=0 makes panel keyboard-reachable when focused */}
      <div
        role="tabpanel"
        id="calc-panel-oz"
        aria-labelledby="calc-tab-oz"
        tabIndex={0}
        hidden={tab !== "oz"}
        className="focus:outline-none"
      >
        <QuickCalculator spots={spots} />
      </div>

      <div
        role="tabpanel"
        id="calc-panel-gram"
        aria-labelledby="calc-tab-gram"
        tabIndex={0}
        hidden={tab !== "gram"}
        className="focus:outline-none"
      >
        <div className="space-y-3">
          <GramCalculator spots={{ gold: spots.gold, silver: spots.silver }} />
          <p className="text-center text-xs text-gray-600">
            Want karat reference tables and a shareable link?{" "}
            <Link href="/gram" className="text-amber-500 hover:text-amber-400 transition-colors">
              Open full calculator →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
