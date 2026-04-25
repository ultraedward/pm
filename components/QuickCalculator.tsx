"use client";

import { useState } from "react";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
type Metal = typeof METALS[number];

const METAL_META: Record<Metal, { label: string; dot: string; symbol: string }> = {
  gold:      { label: "Gold",      dot: "#D4AF37", symbol: "XAU" },
  silver:    { label: "Silver",    dot: "#C0C0C0", symbol: "XAG" },
  platinum:  { label: "Platinum",  dot: "#E5E4E2", symbol: "XPT" },
  palladium: { label: "Palladium", dot: "#9FA8C7", symbol: "XPD" },
};

type Props = {
  spots: Record<Metal, number>;
};

export function QuickCalculator({ spots }: Props) {
  const [oz, setOz] = useState<Record<Metal, string>>({
    gold: "", silver: "", platinum: "", palladium: "",
  });

  const values = METALS.map((m) => ({
    metal: m,
    value: (parseFloat(oz[m]) || 0) * spots[m],
  }));

  const total = values.reduce((s, v) => s + v.value, 0);
  const hasAny = values.some((v) => v.value > 0);

  function fmt(n: number) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  return (
    <div className="space-y-3">
      {/* Input tiles — match the visual weight of the price panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.09] rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {METALS.map((metal) => {
          const { label, dot } = METAL_META[metal];
          const active = parseFloat(oz[metal]) > 0;
          return (
            <div key={metal} className="px-5 py-5 flex flex-col gap-3" style={{ backgroundColor: "var(--surface-2)" }}>
              {/* Metal label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
                </div>
                {active && (
                  <span className="text-xs tabular-nums font-semibold" style={{ color: "var(--gold-bright)" }}>
                    {fmt(values.find(v => v.metal === metal)!.value)}
                  </span>
                )}
              </div>

              {/* Oz input */}
              <div className="flex items-baseline gap-1.5">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="0"
                  placeholder="0"
                  value={oz[metal]}
                  onChange={(e) => setOz((prev) => ({ ...prev, [metal]: e.target.value }))}
                  className="w-full bg-transparent text-2xl font-black tracking-tightest tabular-nums focus:outline-none"
                  style={{ color: "var(--text)" }}
                  data-placeholder-muted
                />
                <span className="text-xs text-gray-700 shrink-0">oz</span>
              </div>

              {/* Spot price */}
              {spots[metal] > 0 && (
                <p className="text-xs tabular-nums text-gray-700">
                  {fmt(spots[metal])} / oz
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Result bar — only renders when there's something to show */}
      {hasAny && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="divide-y divide-white/5">
            {values.filter((v) => v.value > 0).map(({ metal, value }) => {
              const { label, dot } = METAL_META[metal];
              return (
                <div key={metal} className="flex items-center justify-between px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-xs text-gray-700 tabular-nums">{oz[metal]} oz</span>
                  </div>
                  <span className="text-sm tabular-nums font-medium">{fmt(value)}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>Total value</span>
              <span className="text-2xl font-black tabular-nums tracking-tightest" style={{ color: "var(--gold-bright)" }}>
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
