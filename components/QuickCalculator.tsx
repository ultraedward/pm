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
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METALS.map((metal) => {
          const { label, dot } = METAL_META[metal];
          return (
            <div key={metal}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
              </div>
              <input
                type="number"
                inputMode="decimal"
                step="0.001"
                min="0"
                placeholder="0"
                value={oz[metal]}
                onChange={(e) => setOz((prev) => ({ ...prev, [metal]: e.target.value }))}
                className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors tabular-nums"
              />
              {spots[metal] > 0 && (
                <p className="mt-1 text-xs text-gray-700 tabular-nums">
                  {fmt(spots[metal])} / oz
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Result */}
      <div
        className="rounded-xl border transition-all duration-200"
        style={{ borderColor: hasAny ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)" }}
      >
        {hasAny ? (
          <div className="divide-y divide-white/5">
            {values.filter((v) => v.value > 0).map(({ metal, value }) => {
              const { label, dot } = METAL_META[metal];
              return (
                <div key={metal} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-xs text-gray-700 tabular-nums">
                      {oz[metal]} oz
                    </span>
                  </div>
                  <span className="text-sm tabular-nums font-medium">{fmt(value)}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-bold text-white">Total</span>
              <span
                className="text-lg font-black tabular-nums tracking-tightest"
                style={{ color: "var(--gold-bright)" }}
              >
                {fmt(total)}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 text-sm text-gray-700 text-center">
            Enter ounces above to calculate value
          </div>
        )}
      </div>
    </div>
  );
}
