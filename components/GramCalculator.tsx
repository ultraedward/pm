"use client";

import { useState } from "react";

// Troy oz conversion factors
const TO_TROY_OZ: Record<string, number> = {
  g:   1 / 31.1035,  // grams
  dwt: 1 / 20,       // pennyweights (dwt)
  ozt: 1,            // troy oz (already there)
};

const UNIT_LABELS: Record<string, string> = {
  g:   "g",
  dwt: "dwt",
  ozt: "ozt",
};

type Karat = "24k" | "22k" | "18k" | "14k" | "10k" | "9k" | "custom";

const KARATS: { id: Karat; label: string; purity: number | null }[] = [
  { id: "24k",    label: "24k",    purity: 1.0      },
  { id: "22k",    label: "22k",    purity: 22 / 24  },
  { id: "18k",    label: "18k",    purity: 18 / 24  },
  { id: "14k",    label: "14k",    purity: 14 / 24  },
  { id: "10k",    label: "10k",    purity: 10 / 24  },
  { id: "9k",     label: "9k",     purity: 9  / 24  },
  { id: "custom", label: "Custom", purity: null      },
];

type Props = {
  goldSpot: number;  // USD per troy oz
};

export function GramCalculator({ goldSpot }: Props) {
  const [weight, setWeight]         = useState("");
  const [unit, setUnit]             = useState<"g" | "dwt" | "ozt">("g");
  const [karat, setKarat]           = useState<Karat>("18k");
  const [customPurity, setCustomPurity] = useState(""); // 0–100 %

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const weightNum = parseFloat(weight) || 0;
  const karatObj  = KARATS.find((k) => k.id === karat)!;
  const purity    = karat === "custom"
    ? (parseFloat(customPurity) || 0) / 100
    : (karatObj.purity ?? 0);

  const troyOz  = weightNum * TO_TROY_OZ[unit];
  const pureOz  = troyOz * purity;
  const value   = pureOz * goldSpot;
  const hasValue = weightNum > 0 && purity > 0 && goldSpot > 0;

  return (
    <div
      className="rounded-2xl border p-5 space-y-5"
      style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(0,0,0,0.2)" }}
    >
      {/* Weight input + unit toggle */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Weight</p>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1 bg-transparent rounded-xl border px-4 py-3 text-2xl font-black tabular-nums text-white placeholder:text-white/15 focus:outline-none focus:border-amber-500/40 transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          />
          {/* Unit selector */}
          <div
            className="flex flex-col divide-y rounded-xl border overflow-hidden shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.08)", divideColor: "rgba(255,255,255,0.06)" }}
          >
            {(["g", "dwt", "ozt"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 flex-1 text-xs font-bold transition-colors ${
                  unit === u
                    ? "bg-amber-500/15 text-amber-400"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {UNIT_LABELS[u]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Karat / purity selector */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Purity</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {KARATS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKarat(k.id)}
              className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                karat === k.id
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                  : "border text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
              style={karat !== k.id ? { borderColor: "rgba(255,255,255,0.08)" } : {}}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Custom purity input */}
        {karat === "custom" && (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 75.0"
              value={customPurity}
              onChange={(e) => setCustomPurity(e.target.value)}
              className="w-32 bg-transparent rounded-lg border px-3 py-2 text-sm font-bold tabular-nums text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/40 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            />
            <span className="text-sm text-gray-600">% pure gold</span>
          </div>
        )}
      </div>

      {/* Result */}
      <div
        className={`rounded-xl border px-5 py-4 transition-all ${
          hasValue
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-white/5 bg-white/[0.02]"
        }`}
      >
        {hasValue ? (
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-600">
                {weightNum} {UNIT_LABELS[unit]} ·{" "}
                {karat === "custom"
                  ? `${customPurity || 0}% pure`
                  : karatObj.label}{" "}
                · {pureOz.toFixed(4)} ozt pure gold
              </p>
              <p className="text-xs text-gray-700 tabular-nums">
                Spot {fmt(goldSpot)} / ozt
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
          <p className="text-sm text-gray-700 text-center">
            Enter a weight above to see the value
          </p>
        )}
      </div>

      {/* Spot reference */}
      {goldSpot > 0 && (
        <p className="text-[10px] tabular-nums text-gray-700 text-right">
          Gold spot: {fmt(goldSpot)} / troy oz
        </p>
      )}
    </div>
  );
}
