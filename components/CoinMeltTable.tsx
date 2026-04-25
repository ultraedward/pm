"use client";

import { useState, useCallback } from "react";

type Metal = "silver" | "gold";

type CoinSpec = {
  id: string;
  name: string;
  note: string;
  asw: number; // troy oz of pure metal
};

const SILVER_COINS: CoinSpec[] = [
  { id: "ase",      name: "American Silver Eagle",       note: "1986–present · 1 oz .999",         asw: 1.0000 },
  { id: "maple_ag", name: "Canadian Silver Maple Leaf",  note: "1988–present · 1 oz .9999",        asw: 1.0000 },
  { id: "morgan",   name: "Morgan Dollar",               note: "1878–1921 · 90% silver",           asw: 0.7734 },
  { id: "peace",    name: "Peace Dollar",                note: "1921–1935 · 90% silver",           asw: 0.7734 },
  { id: "wlh",      name: "Walking Liberty Half",        note: "1916–1947 · 90% silver",           asw: 0.3617 },
  { id: "fh",       name: "Franklin Half Dollar",        note: "1948–1963 · 90% silver",           asw: 0.3617 },
  { id: "kh64",     name: "Kennedy Half Dollar",         note: "1964 · 90% silver",                asw: 0.3617 },
  { id: "kh40",     name: "Kennedy Half Dollar",         note: "1965–1970 · 40% silver",           asw: 0.1479 },
  { id: "wq",       name: "Washington Quarter",          note: "1932–1964 · 90% silver",           asw: 0.1808 },
  { id: "roos",     name: "Roosevelt Dime",              note: "1946–1964 · 90% silver",           asw: 0.0723 },
  { id: "merc",     name: "Mercury Dime",                note: "1916–1945 · 90% silver",           asw: 0.0723 },
  { id: "war5",     name: "Wartime Nickel",              note: "1942–1945 · 35% silver",           asw: 0.0563 },
];

const GOLD_COINS: CoinSpec[] = [
  { id: "age1",      name: "American Gold Eagle",        note: "1 oz · 22k",                       asw: 1.0000 },
  { id: "age_half",  name: "American Gold Eagle",        note: "½ oz · 22k",                       asw: 0.5000 },
  { id: "age_qtr",   name: "American Gold Eagle",        note: "¼ oz · 22k",                       asw: 0.2500 },
  { id: "age_10th",  name: "American Gold Eagle",        note: "1/10 oz · 22k",                    asw: 0.1000 },
  { id: "buffalo",   name: "American Gold Buffalo",      note: "1 oz · .9999 fine",                asw: 1.0000 },
  { id: "maple_au",  name: "Canadian Gold Maple Leaf",   note: "1 oz · .9999 fine",                asw: 1.0000 },
  { id: "kruger",    name: "South African Krugerrand",   note: "1 oz · 22k",                       asw: 1.0000 },
];

const TABS: { id: Metal; label: string; dot: string; coins: CoinSpec[] }[] = [
  { id: "silver", label: "Silver",  dot: "#C0C0C0", coins: SILVER_COINS },
  { id: "gold",   label: "Gold",    dot: "#D4AF37", coins: GOLD_COINS   },
];

type Props = {
  spots: { silver: number; gold: number };
  updatedAt: string | null;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtAge(ts: string | null): string {
  if (!ts) return "Updating…";
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 1)  return "Live";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function CoinMeltTable({ spots, updatedAt }: Props) {
  const [activeTab, setActiveTab] = useState<Metal>("silver");
  const [qty, setQty] = useState<Record<string, string>>({});

  const tab     = TABS.find((t) => t.id === activeTab)!;
  const spot    = spots[activeTab];

  const getQty  = (id: string) => Math.max(0, parseFloat(qty[id] || "") || 0);
  const getMelt = (asw: number) => asw * spot;

  const grandTotal = tab.coins.reduce((sum, c) => sum + getQty(c.id) * getMelt(c.asw), 0);

  const handleQty = useCallback((id: string, val: string) => {
    setQty((prev) => ({ ...prev, [id]: val }));
  }, []);

  return (
    <div className="space-y-5">

      {/* ── Spot price bar ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-xl border"
        style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.25)" }}
      >
        <div className="flex gap-6 flex-wrap">
          {TABS.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.dot }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: t.id === activeTab ? "white" : "var(--text-dim)" }}
              >
                {t.label}
              </span>
              <span
                className="text-sm font-black tabular-nums"
                style={{ color: t.id === activeTab ? "var(--gold-bright)" : "var(--text-dim)" }}
              >
                {spots[t.id] > 0 ? `${fmt(spots[t.id])} / oz` : "—"}
              </span>
            </div>
          ))}
        </div>
        <span className="text-[10px] text-gray-700 tabular-nums shrink-0">{fmtAge(updatedAt)}</span>
      </div>

      {/* ── Metal tabs ─────────────────────────────────────────── */}
      <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-5 py-2.5 text-sm font-bold relative transition-colors"
            style={{ color: activeTab === t.id ? "white" : "var(--text-dim)" }}
          >
            {t.label}
            {activeTab === t.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: "var(--gold)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Coin table ─────────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>

        {/* Header row */}
        <div
          className="grid items-center px-5 py-2.5 border-b"
          style={{
            gridTemplateColumns: "1fr auto auto",
            borderColor: "var(--border)",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Coin</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 text-right pr-4">Melt value</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center w-14">Qty</span>
        </div>

        {/* Coin rows */}
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {tab.coins.map((coin) => {
            const q     = getQty(coin.id);
            const melt  = getMelt(coin.asw);
            const total = q * melt;
            const active = q > 0;

            return (
              <div
                key={coin.id}
                className="grid items-center px-5 py-4 gap-3 transition-colors"
                style={{
                  gridTemplateColumns: "1fr auto auto",
                  background: active ? "rgba(212,175,55,0.03)" : undefined,
                }}
              >
                {/* Coin info */}
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{coin.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{coin.note}</p>
                  {active && (
                    <p
                      className="text-xs font-semibold tabular-nums mt-1"
                      style={{ color: "var(--gold-bright)" }}
                    >
                      {q} × {fmt(melt)} = {fmt(total)}
                    </p>
                  )}
                </div>

                {/* Melt value */}
                <span
                  className="text-sm font-bold tabular-nums text-right pr-4 whitespace-nowrap"
                  style={{ color: active ? "white" : "var(--text-muted)" }}
                >
                  {fmt(melt)}
                </span>

                {/* Qty input */}
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

        {/* Grand total — only when at least one coin has a qty */}
        {grandTotal > 0 && (
          <div
            className="flex items-center justify-between px-5 py-5 border-t"
            style={{
              borderColor: "var(--border)",
              background: "rgba(212,175,55,0.05)",
            }}
          >
            <span className="text-sm font-bold text-white">Total melt value</span>
            <span
              className="text-2xl font-black tabular-nums tracking-tighter"
              style={{ color: "var(--gold-bright)" }}
            >
              {fmt(grandTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Helper note */}
      <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
        Melt value = troy oz content × live spot price · Enter quantities to total your stack
      </p>
    </div>
  );
}
