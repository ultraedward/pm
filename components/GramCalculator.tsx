"use client";

import { useState } from "react";

// ─── unit conversions to troy oz ─────────────────────────────────────────────
const TO_TROY_OZ: Record<string, number> = {
  g:   1 / 31.1035,
  dwt: 1 / 20,
  ozt: 1,
};

// ─── gold karats ─────────────────────────────────────────────────────────────
type GoldKarat = "24k" | "22k" | "18k" | "14k" | "10k" | "9k" | "custom";

const GOLD_KARATS: { id: GoldKarat; label: string; purity: number | null; pct: string | null }[] = [
  { id: "24k",    label: "24k",    purity: 1.0,      pct: "99.9%" },
  { id: "22k",    label: "22k",    purity: 22 / 24,  pct: "91.7%" },
  { id: "18k",    label: "18k",    purity: 18 / 24,  pct: "75.0%" },
  { id: "14k",    label: "14k",    purity: 14 / 24,  pct: "58.3%" },
  { id: "10k",    label: "10k",    purity: 10 / 24,  pct: "41.7%" },
  { id: "9k",     label: "9k",     purity:  9 / 24,  pct: "37.5%" },
  { id: "custom", label: "Custom", purity: null,      pct: null    },
];

// ─── silver purities ──────────────────────────────────────────────────────────
type SilverPurity = "999" | "958" | "925" | "900" | "800" | "custom";

const SILVER_PURITIES: { id: SilverPurity; label: string; purity: number | null; pct: string | null }[] = [
  { id: "999",    label: ".999",      purity: 0.999,  pct: "Fine"     },
  { id: "958",    label: ".958",      purity: 0.958,  pct: "Brit."    },
  { id: "925",    label: "925",       purity: 0.925,  pct: "Sterling" },
  { id: "900",    label: "900",       purity: 0.900,  pct: "Coin"     },
  { id: "800",    label: "800",       purity: 0.800,  pct: "Euro"     },
  { id: "custom", label: "Custom",    purity: null,   pct: null       },
];

type Props = {
  spots: { gold: number; silver: number };
};

type Metal = "gold" | "silver";

const UNIT_LABELS = { g: "g", dwt: "dwt", ozt: "ozt" };

export function GramCalculator({ spots }: Props) {
  const [metal, setMetal]           = useState<Metal>("gold");
  const [weight, setWeight]         = useState("");
  const [unit, setUnit]             = useState<"g" | "dwt" | "ozt">("g");
  const [goldKarat, setGoldKarat]   = useState<GoldKarat>("18k");
  const [silverPurity, setSilverPurity] = useState<SilverPurity>("925");
  const [customPct, setCustomPct]   = useState("");

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const spotPrice = metal === "gold" ? spots.gold : spots.silver;

  const selectedGold   = GOLD_KARATS.find((k) => k.id === goldKarat)!;
  const selectedSilver = SILVER_PURITIES.find((p) => p.id === silverPurity)!;

  const purityObj = metal === "gold" ? selectedGold : selectedSilver;
  const isCustom  = purityObj.id === "custom";
  const purity    = isCustom
    ? (parseFloat(customPct) || 0) / 100
    : (purityObj.purity ?? 0);

  const weightNum = parseFloat(weight) || 0;
  const troyOz    = weightNum * TO_TROY_OZ[unit];
  const pureOz    = troyOz * purity;
  const value     = pureOz * spotPrice;
  const hasValue  = weightNum > 0 && purity > 0 && spotPrice > 0;

  const karats  = metal === "gold" ? GOLD_KARATS   : SILVER_PURITIES;
  const setKarat = metal === "gold"
    ? (id: string) => setGoldKarat(id as GoldKarat)
    : (id: string) => setSilverPurity(id as SilverPurity);
  const currentKarat = metal === "gold" ? goldKarat : silverPurity;

  return (
    <div className="space-y-4">

      {/* ── Result — always visible at top, updates live ─────────── */}
      <div
        className={`rounded-xl border px-5 py-4 transition-all duration-200 ${
          hasValue
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-white/5 bg-white/[0.02]"
        }`}
      >
        {hasValue ? (
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">
                {weightNum} {UNIT_LABELS[unit]} ·{" "}
                {isCustom ? `${customPct || 0}% pure` : purityObj.label}{" "}
                · {(pureOz * 31.1035).toFixed(3)}g pure {metal}
              </p>
              <p className="text-[10px] text-gray-700 tabular-nums">
                Spot {fmt(spotPrice)} / troy oz
              </p>
            </div>
            <p
              className="text-3xl font-black tabular-nums tracking-tighter shrink-0"
              style={{ color: "var(--gold-bright, #D4AF37)" }}
            >
              {fmt(value)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center py-1">
            Enter a weight below to see the melt value
          </p>
        )}
      </div>

      {/* ── Metal toggle ─────────────────────────────────────────── */}
      <div
        className="flex rounded-xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {(["gold", "silver"] as Metal[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetal(m)}
            className={`flex-1 py-2.5 text-sm font-bold capitalize transition-colors ${
              metal === m
                ? "bg-amber-500/15 text-amber-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {m === "gold" ? "🥇 Gold" : "🥈 Silver"}
          </button>
        ))}
      </div>

      {/* ── Weight input + unit toggle ───────────────────────────── */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Weight</p>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-transparent rounded-xl border px-4 py-3 text-2xl font-black tabular-nums text-white placeholder:text-white/15 focus:outline-none focus:border-amber-500/40 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="flex rounded-lg border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {(["g", "dwt", "ozt"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 py-2 text-xs font-bold transition-colors ${
                unit === u
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {u === "g" ? "Grams (g)" : u === "dwt" ? "Pennyweight (dwt)" : "Troy oz (ozt)"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Purity selector ──────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Purity</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {karats.map((k) => (
            <button
              key={k.id}
              onClick={() => setKarat(k.id)}
              className={`rounded-lg py-2 px-1 text-center transition-colors ${
                currentKarat === k.id
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                  : "border text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
              style={currentKarat !== k.id ? { borderColor: "rgba(255,255,255,0.08)" } : {}}
            >
              <span className="block text-xs font-bold">{k.label}</span>
              {k.pct && (
                <span className="block text-[10px] opacity-60 mt-0.5">{k.pct}</span>
              )}
            </button>
          ))}
        </div>

        {isCustom && (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 75.0"
              value={customPct}
              onChange={(e) => setCustomPct(e.target.value)}
              className="w-32 bg-transparent rounded-lg border px-3 py-2 text-sm font-bold tabular-nums text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            />
            <span className="text-sm text-gray-600">% pure {metal}</span>
          </div>
        )}
      </div>
    </div>
  );
}
