"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ── Types ───────────────────────────────────────────────────── */

type Metal = "gold" | "silver" | "platinum" | "palladium";

interface Holding {
  id: string;
  metal: Metal;
  ounces: number;
  purchasePrice: number; // per oz
  purchaseDate: string;  // yyyy-mm-dd
  notes?: string;
}

interface SpotPrices {
  gold: number | null;
  silver: number | null;
  platinum: number | null;
  palladium: number | null;
}

/* ── Constants ───────────────────────────────────────────────── */

const STORAGE_KEY = "lode_local_holdings";

const METAL_META: Record<Metal, { label: string; dot: string; symbol: string }> = {
  gold:      { label: "Gold",      dot: "#D4AF37", symbol: "XAU" },
  silver:    { label: "Silver",    dot: "#C0C0C0", symbol: "XAG" },
  platinum:  { label: "Platinum",  dot: "#E5E4E2", symbol: "XPT" },
  palladium: { label: "Palladium", dot: "#9FA8C7", symbol: "XPD" },
};

const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmt(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ── localStorage helpers ────────────────────────────────────── */

function loadHoldings(): Holding[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHoldings(holdings: Holding[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
}

/* ── Main component ──────────────────────────────────────────── */

export default function LocalPortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [spots, setSpots] = useState<SpotPrices>({ gold: null, silver: null, platinum: null, palladium: null });
  const [pricesLoading, setPricesLoading] = useState(true);
  const [priceError, setPriceError] = useState(false);

  // Form state
  const [metal, setMetal] = useState<Metal>("gold");
  const [ounces, setOunces] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState(false);

  // Load holdings from localStorage on mount
  useEffect(() => {
    setHoldings(loadHoldings());
  }, []);

  // Fetch spot prices
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices/current");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (!data.ok) throw new Error("bad response");
      setSpots({ gold: data.gold, silver: data.silver, platinum: data.platinum, palladium: data.palladium });
      setPriceError(false);
    } catch {
      setPriceError(true);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchPrices]);

  /* ── CRUD ────────────────────────────────────────────────────── */

  function addHolding(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormOk(false);

    const oz = parseFloat(ounces);
    const pp = parseFloat(purchasePrice);

    if (!oz || oz <= 0) { setFormError("Enter a valid ounce amount"); return; }
    if (!pp || pp <= 0) { setFormError("Enter a valid price per oz"); return; }

    const holding: Holding = {
      id: uid(),
      metal,
      ounces: oz,
      purchasePrice: pp,
      purchaseDate,
      notes: notes.trim() || undefined,
    };

    const updated = [holding, ...holdings];
    setHoldings(updated);
    saveHoldings(updated);

    // Reset form
    setOunces("");
    setPurchasePrice("");
    setNotes("");
    setFormOk(true);
    setTimeout(() => setFormOk(false), 2500);
  }

  function deleteHolding(id: string) {
    const updated = holdings.filter((h) => h.id !== id);
    setHoldings(updated);
    saveHoldings(updated);
  }

  /* ── Derived values ──────────────────────────────────────────── */

  const spotMap: Record<Metal, number> = {
    gold:      spots.gold      ?? 0,
    silver:    spots.silver    ?? 0,
    platinum:  spots.platinum  ?? 0,
    palladium: spots.palladium ?? 0,
  };

  const totalInvested = holdings.reduce((s, h) => s + h.ounces * h.purchasePrice, 0);
  const totalValue    = holdings.reduce((s, h) => s + h.ounces * (spotMap[h.metal] || h.purchasePrice), 0);
  const gainLoss      = totalValue - totalInvested;
  const gainPct       = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  const isUp          = gainLoss >= 0;

  type MetalSummary = {
    metal: Metal;
    totalOz: number;
    avgCost: number;
    currentSpot: number;
    currentValue: number;
    gl: number;
    glPct: number;
  };

  const metalSummaries: MetalSummary[] = METALS.flatMap((m) => {
    const lots = holdings.filter((h) => h.metal === m);
    if (!lots.length) return [];
    const totalOz      = lots.reduce((s, h) => s + h.ounces, 0);
    const totalCost    = lots.reduce((s, h) => s + h.ounces * h.purchasePrice, 0);
    const avgCost      = totalCost / totalOz;
    const currentSpot  = spotMap[m] || avgCost;
    const currentValue = totalOz * currentSpot;
    const gl           = currentValue - totalCost;
    const glPct        = totalCost > 0 ? (gl / totalCost) * 100 : 0;
    return [{ metal: m, totalOz, avgCost, currentSpot, currentValue, gl, glPct }];
  });

  const metalValues = METALS.map((m) => ({
    metal: m,
    value: holdings.filter((h) => h.metal === m).reduce((s, h) => s + h.ounces * (spotMap[m] || h.purchasePrice), 0),
  }));

  /* ── Render ──────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <span style={{ color: "var(--gold-bright)" }}>🔒</span>
        Your holdings stay on this device — no account needed, nothing sent to our servers
      </div>

      {/* Spot prices row */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Live Spot Prices</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/5">
          {METALS.map((m) => {
            const price = spots[m];
            const meta  = METAL_META[m];
            return (
              <div key={m} className="px-4 py-4 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{meta.label}</p>
                </div>
                <p className="text-xl font-black tabular-nums">
                  {pricesLoading ? <span className="text-gray-700 animate-pulse">···</span>
                   : price ? fmt(price)
                   : <span className="text-gray-700">—</span>}
                </p>
              </div>
            );
          })}
        </div>
        {priceError && (
          <p className="px-5 py-2 text-xs text-red-400 border-t" style={{ borderColor: "var(--border)" }}>
            Could not load live prices — showing cost basis values
          </p>
        )}
      </div>

      {/* Portfolio total */}
      {holdings.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-gray-950 px-6 py-7 space-y-2">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">Total Portfolio Value</p>
          <p className="text-5xl font-black tracking-tightest tabular-nums leading-none">
            {fmt(totalValue)}
          </p>
          {totalInvested > 0 && (
            <p className={`text-sm font-medium tabular-nums ${isUp ? "text-amber-400" : "text-red-400"}`}>
              {isUp ? "+" : ""}{fmt(gainLoss)} ({isUp ? "+" : ""}{gainPct.toFixed(2)}%) vs cost basis
            </p>
          )}
        </div>
      )}

      {/* Allocation bars */}
      {holdings.length > 0 && totalValue > 0 && (
        <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Allocation</p>
          {metalValues.filter(({ value }) => value > 0).map(({ metal: m, value }) => {
            const pct  = (value / totalValue) * 100;
            const meta = METAL_META[m];
            return (
              <div key={m}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium" style={{ color: meta.dot }}>{meta.label}</span>
                  <span className="tabular-nums text-gray-400">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: meta.dot }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Per-metal summary */}
      {metalSummaries.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {metalSummaries.map((s, i) => {
            const meta  = METAL_META[s.metal];
            const isUp  = s.gl >= 0;
            return (
              <div
                key={s.metal}
                className={`flex items-center justify-between px-6 py-4 gap-4 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.dot }} />
                  <div>
                    <p className="text-sm font-bold">{meta.label}</p>
                    <p className="text-xs text-gray-500 tabular-nums">
                      {s.totalOz.toFixed(3)} oz · avg {fmt(s.avgCost)}/oz
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums">{fmt(s.currentValue)}</p>
                  <p className={`text-xs tabular-nums font-medium ${isUp ? "text-amber-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{fmt(s.gl)} ({isUp ? "+" : ""}{s.glPct.toFixed(2)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add holding form */}
      <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Add Holding</p>

        <form onSubmit={addHolding} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Metal</label>
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value as Metal)}
                className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="palladium">Palladium</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Troy ounces</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={ounces}
                onChange={(e) => setOunces(e.target.value)}
                placeholder="e.g. 1.000"
                required
                className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Price paid per oz</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder={spotMap[metal] ? `e.g. ${spotMap[metal].toFixed(2)}` : "e.g. 3200.00"}
                required
                className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Purchase date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
                className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes <span className="text-gray-700">(optional)</span></label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Costco 1oz bar"
              className="w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {formError && <p className="text-xs text-red-400">{formError}</p>}
          {formOk    && <p className="text-xs text-amber-400">Holding added ✓</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
          >
            Add to stack
          </button>
        </form>
      </div>

      {/* Holdings list */}
      {holdings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-gray-950 p-10 text-center space-y-2">
          <p className="text-lg font-black tracking-tight">No holdings yet</p>
          <p className="text-sm text-gray-500">Add your first position above to see your portfolio value.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">Individual Positions</p>
          {holdings.map((h) => {
            const spot      = spotMap[h.metal] || h.purchasePrice;
            const value     = h.ounces * spot;
            const invested  = h.ounces * h.purchasePrice;
            const gl        = value - invested;
            const glPct     = invested > 0 ? (gl / invested) * 100 : 0;
            const meta      = METAL_META[h.metal];
            const isUp      = gl >= 0;

            return (
              <div key={h.id} className="rounded-2xl border border-white/5 bg-gray-950 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.dot }} />
                      <p className="font-bold text-white capitalize">{meta.label}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 tabular-nums">
                      {h.ounces.toFixed(3)} oz @ {fmt(h.purchasePrice)}/oz
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(h.purchaseDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      {h.notes ? ` · ${h.notes}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">{fmt(value)}</p>
                    <p className={`text-xs tabular-nums font-medium mt-0.5 ${isUp ? "text-amber-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}{fmt(gl)} ({isUp ? "+" : ""}{glPct.toFixed(2)}%)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteHolding(h.id)}
                  className="rounded-full border border-red-500/20 px-4 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sync upsell */}
      <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 text-center space-y-3">
        <p className="text-sm font-bold text-white">Want to sync across devices?</p>
        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
          Create a free account to save your stack to the cloud — accessible from any device, with price alerts included.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          Create free account →
        </Link>
      </div>
    </div>
  );
}
