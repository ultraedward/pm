"use client";

import { useState, useCallback } from "react";

type CoinSpec = {
  id: string;
  name: string;
  note: string;
  asw: number;      // troy oz of pure silver per coin
  face: number;     // face value in dollars
};

const JUNK_COINS: CoinSpec[] = [
  { id: "dime_90",  name: "Silver Dime",          note: "Roosevelt or Mercury · pre-1965 · 90%",  asw: 0.07234, face: 0.10 },
  { id: "qtr_90",   name: "Silver Quarter",        note: "Washington · pre-1965 · 90%",            asw: 0.18084, face: 0.25 },
  { id: "half_90",  name: "Half Dollar (90%)",     note: "Walking Liberty, Franklin, or 1964 Kennedy · 90%", asw: 0.36169, face: 0.50 },
  { id: "half_40",  name: "Half Dollar (40%)",     note: "Kennedy · 1965–1970 · 40%",             asw: 0.14792, face: 0.50 },
  { id: "dollar_90",name: "Silver Dollar (90%)",   note: "Morgan or Peace · 90%",                  asw: 0.77344, face: 1.00 },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtOz(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

type Props = {
  silverSpot: number;
};

export function JunkSilverCalculator({ silverSpot }: Props) {
  const [qty, setQty] = useState<Record<string, string>>({});
  const [faceInput, setFaceInput] = useState("");

  const getQty = (id: string) => Math.max(0, parseFloat(qty[id] || "") || 0);

  // Per-coin totals
  const totalOz   = JUNK_COINS.reduce((sum, c) => sum + getQty(c.id) * c.asw, 0);
  const totalFace = JUNK_COINS.reduce((sum, c) => sum + getQty(c.id) * c.face, 0);
  const totalMelt = totalOz * silverSpot;
  const hasCoins  = totalOz > 0;

  // Face value shortcut ($1 face value = 0.715 oz by industry convention)
  const faceVal   = parseFloat(faceInput) || 0;
  const faceOz    = faceVal * 0.715;
  const faceMelt  = faceOz * silverSpot;

  const handleQty = useCallback((id: string, val: string) => {
    setQty((prev) => ({ ...prev, [id]: val }));
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Face-value shortcut ─────────────────────────────────── */}
      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.25)" }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Quick calculation</p>
          <p className="text-sm text-gray-400">Enter a total face value in 90% junk silver</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.10"
              placeholder="0.00"
              value={faceInput}
              onChange={(e) => setFaceInput(e.target.value)}
              className="w-32 rounded-xl border bg-white/5 pl-7 pr-3 py-2.5 text-sm font-bold tabular-nums text-white placeholder:text-white/15 focus:outline-none transition-colors"
              style={{ borderColor: faceVal > 0 ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)" }}
            />
          </div>
          <span className="text-xs text-gray-600">face value</span>
          {faceVal > 0 && (
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="text-gray-400">
                ≈ <span className="font-bold text-white tabular-nums">{fmtOz(faceOz)} oz</span> silver
              </span>
              {silverSpot > 0 && (
                <span
                  className="text-base font-black tabular-nums"
                  style={{ color: "var(--gold-bright)" }}
                >
                  {fmt(faceMelt)}
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          Uses the 0.715 oz/$ industry standard for 90% silver — accounts for average coin wear
        </p>
      </div>

      {/* ── Coin-by-coin calculator ─────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Or count coin by coin</p>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>

          {/* Header */}
          <div
            className="grid items-center px-5 py-2.5 border-b"
            style={{
              gridTemplateColumns: "1fr auto auto",
              borderColor: "var(--border)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Coin type</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 text-right pr-4">Melt / coin</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center w-14">Qty</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {JUNK_COINS.map((coin) => {
              const q      = getQty(coin.id);
              const melt   = coin.asw * silverSpot;
              const lineTot = q * melt;
              const active  = q > 0;

              return (
                <div
                  key={coin.id}
                  className="grid items-center px-5 py-4 gap-3 transition-colors"
                  style={{
                    gridTemplateColumns: "1fr auto auto",
                    background: active ? "rgba(212,175,55,0.03)" : undefined,
                  }}
                >
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{coin.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{coin.note}</p>
                    {active && (
                      <p
                        className="text-xs font-semibold tabular-nums mt-1"
                        style={{ color: "var(--gold-bright)" }}
                      >
                        {q} × {fmt(melt)} = {fmt(lineTot)}
                      </p>
                    )}
                  </div>

                  <span
                    className="text-sm font-bold tabular-nums text-right pr-4 whitespace-nowrap"
                    style={{ color: active ? "var(--text)" : "var(--text-muted)" }}
                  >
                    {silverSpot > 0 ? fmt(melt) : "—"}
                  </span>

                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={qty[coin.id] ?? ""}
                    onChange={(e) => handleQty(coin.id, e.target.value)}
                    className="w-14 rounded-lg border bg-white/5 px-2 py-1.5 text-center text-sm font-bold tabular-nums text-white placeholder:text-white/15 focus:outline-none transition-colors"
                    style={{
                      borderColor: active
                        ? "rgba(212,175,55,0.4)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Totals */}
          {hasCoins && (
            <div
              className="border-t px-5 py-5 space-y-2"
              style={{ borderColor: "var(--border)", background: "rgba(212,175,55,0.05)" }}
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Face value</span>
                <span className="tabular-nums font-semibold text-gray-400">{fmt(totalFace)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Silver content</span>
                <span className="tabular-nums font-semibold text-gray-400">{fmtOz(totalOz)} troy oz</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Total melt value</span>
                <span
                  className="text-2xl font-black tabular-nums tracking-tighter"
                  style={{ color: "var(--gold-bright)" }}
                >
                  {silverSpot > 0 ? fmt(totalMelt) : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
        Melt value = troy oz silver content × live spot price · Numbers reflect raw silver weight, not numismatic value
      </p>
    </div>
  );
}
