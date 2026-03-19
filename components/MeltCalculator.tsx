"use client";

import { useState } from "react";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
type Metal = (typeof METALS)[number];

type CoinSpec = { id: string; label: string; oz: number };

const COIN_SPECS: Record<Metal, CoinSpec[]> = {
  gold: [
    { id: "eagle_1",    label: "American Eagle 1 oz",     oz: 1.0    },
    { id: "eagle_half", label: "American Eagle ½ oz",     oz: 0.5    },
    { id: "eagle_qtr",  label: "American Eagle ¼ oz",     oz: 0.25   },
    { id: "eagle_10th", label: "American Eagle 1/10 oz",  oz: 0.1    },
    { id: "maple_1",    label: "Maple Leaf 1 oz",         oz: 1.0    },
    { id: "maple_half", label: "Maple Leaf ½ oz",         oz: 0.5    },
    { id: "maple_qtr",  label: "Maple Leaf ¼ oz",         oz: 0.25   },
    { id: "maple_10th", label: "Maple Leaf 1/10 oz",      oz: 0.1    },
    { id: "kruger",     label: "Krugerrand 1 oz",         oz: 1.0    },
    { id: "buffalo",    label: "Buffalo 1 oz",            oz: 1.0    },
  ],
  silver: [
    { id: "eagle",   label: "American Eagle",  oz: 1.0       },
    { id: "maple",   label: "Maple Leaf",       oz: 1.0       },
    { id: "morgan",  label: "Morgan Dollar",    oz: 0.7734    },
    { id: "peace",   label: "Peace Dollar",     oz: 0.7734    },
    { id: "half",    label: "Half Dollar",      oz: 0.36169   },
    { id: "quarter", label: "Quarter",          oz: 0.18084   },
    { id: "dime",    label: "Dime",             oz: 0.07234   },
  ],
  platinum: [
    { id: "eagle",   label: "American Eagle",  oz: 1.0 },
  ],
  palladium: [
    { id: "eagle",   label: "American Eagle",  oz: 1.0 },
  ],
};

const METAL_META: Record<Metal, { label: string; dot: string }> = {
  gold:      { label: "Gold",      dot: "#D4AF37" },
  silver:    { label: "Silver",    dot: "#C0C0C0" },
  platinum:  { label: "Platinum",  dot: "#E5E4E2" },
  palladium: { label: "Palladium", dot: "#9FA8C7" },
};

type Quantities = Record<Metal, Record<string, string>>;

function makeInitialQty(): Quantities {
  const q = {} as Quantities;
  for (const metal of METALS) {
    q[metal] = {};
    for (const coin of COIN_SPECS[metal]) {
      q[metal][coin.id] = "";
    }
  }
  return q;
}

type Props = { spots: Record<Metal, number>; isPro?: boolean };

export function MeltCalculator({ spots, isPro = false }: Props) {
  const [qty, setQty] = useState<Quantities>(makeInitialQty());

  function setQtyFor(metal: Metal, coinId: string, val: string) {
    setQty((prev) => ({
      ...prev,
      [metal]: { ...prev[metal], [coinId]: val },
    }));
  }

  function fmt(n: number) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  // Per-metal oz & value totals
  const metalTotals = METALS.map((metal) => {
    const totalOz = COIN_SPECS[metal].reduce((sum, coin) => {
      return sum + (parseFloat(qty[metal][coin.id]) || 0) * coin.oz;
    }, 0);
    return { metal, totalOz, value: totalOz * spots[metal] };
  });

  const grandTotal = metalTotals.reduce((s, m) => s + m.value, 0);
  const hasAny = metalTotals.some((m) => m.value > 0);

  return (
    <div className="space-y-3">

      {/* 2×2 tile grid — different coin counts make 2-col layout visually cleaner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {METALS.map((metal) => {
          const { label, dot } = METAL_META[metal];
          const coins = COIN_SPECS[metal];
          const metalTotal = metalTotals.find((m) => m.metal === metal)!;
          const hasValue = metalTotal.value > 0;
          const isLocked = !isPro && metal !== "gold";

          if (isLocked) {
            return (
              <a
                key={metal}
                href="/pricing"
                className="rounded-2xl border bg-black/20 px-5 py-5 flex flex-col gap-3 relative overflow-hidden cursor-pointer hover:border-amber-500/20 transition-colors group"
                style={{ borderColor: "rgba(212,175,55,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-shrink-0 opacity-40" style={{ backgroundColor: dot }} />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{label}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Pro</span>
                </div>
                <div className="space-y-2.5 opacity-25 pointer-events-none select-none">
                  {coins.slice(0, 2).map((coin) => (
                    <div key={coin.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-300 leading-tight truncate">{coin.label}</p>
                        <p className="text-[10px] text-gray-600 tabular-nums">{coin.oz} troy oz</p>
                      </div>
                      <div className="w-16 h-8 rounded-lg border bg-white/5" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-500/70 group-hover:text-amber-400 transition-colors">Unlock with Pro →</p>
              </a>
            );
          }

          return (
            <div
              key={metal}
              className="rounded-2xl border bg-black/20 px-5 py-5 flex flex-col gap-4"
              style={{ borderColor: "rgba(212,175,55,0.12)" }}
            >
              {/* Tile header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
                  {metal === "silver" && (
                    <span className="text-[10px] text-gray-600">· pre-1965</span>
                  )}
                </div>
                {hasValue && (
                  <span className="text-xs tabular-nums font-semibold" style={{ color: "var(--gold-bright)" }}>
                    {fmt(metalTotal.value)}
                  </span>
                )}
              </div>

              {/* Coin rows */}
              <div className="space-y-2.5">
                {coins.map((coin) => (
                  <div key={coin.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 leading-tight truncate">{coin.label}</p>
                      <p className="text-[10px] text-gray-600 tabular-nums">{coin.oz} troy oz</p>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={qty[metal][coin.id]}
                      onChange={(e) => setQtyFor(metal, coin.id, e.target.value)}
                      className="w-16 shrink-0 rounded-lg border bg-white/5 px-2 py-1.5 text-right text-sm font-bold tabular-nums text-white placeholder:text-white/15 focus:outline-none focus:border-amber-500/40 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.08)" }}
                    />
                  </div>
                ))}
              </div>

              {/* Spot reference */}
              {spots[metal] > 0 && (
                <p className="text-[10px] tabular-nums text-gray-700 mt-auto pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  Spot: {fmt(spots[metal])} / oz
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Result bar — only when at least one coin has a quantity */}
      {hasAny && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(212,175,55,0.2)" }}
        >
          <div className="divide-y divide-white/5">
            {metalTotals.filter((m) => m.value > 0).map(({ metal, totalOz, value }) => {
              const { label, dot } = METAL_META[metal];
              return (
                <div key={metal} className="flex items-center justify-between px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-xs text-gray-700 tabular-nums">{totalOz.toFixed(4)} oz</span>
                  </div>
                  <span className="text-sm tabular-nums font-medium">{fmt(value)}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-bold text-white">Total coin value</span>
              <span className="text-2xl font-black tabular-nums tracking-tightest" style={{ color: "var(--gold-bright)" }}>
                {fmt(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
