"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COMPARE_COINS, type CompareCoin } from "@/lib/compare/coins";
import { DEALERS } from "@/lib/compare/dealers";
import { PREMIUMS } from "@/lib/compare/premiums";

type Spots = { gold: number; silver: number };

// URL map: { [coinId]: { [dealerId]: string } } — precomputed server-side so
// affiliate IDs from process.env never leak to the client bundle.
export type DealerUrlMap = Record<string, Record<string, string>>;

type Props = { spots: Spots; dealerUrls: DealerUrlMap };

type Row = {
  dealerId: string;
  dealerName: string;
  short: string;
  url: string;
  premium: number;
  total: number;
};

function fmtUSD(n: number, opts: { cents?: boolean } = {}) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents === false ? 0 : 2,
    maximumFractionDigits: opts.cents === false ? 0 : 2,
  });
}

function buildRows(coin: CompareCoin, spots: Spots, dealerUrls: DealerUrlMap): Row[] {
  const spot = coin.metal === "gold" ? spots.gold : spots.silver;
  const melt = coin.oz * spot;
  return DEALERS
    .map((d) => {
      const premium = PREMIUMS[coin.id]?.[d.id] ?? 0;
      const url = dealerUrls[coin.id]?.[d.id] ?? "";
      return {
        dealerId: d.id,
        dealerName: d.name,
        short: d.short,
        url,
        premium,
        total: melt + premium,
      };
    })
    // Skip dealers we don't yet have a verified product URL for. The comparison
    // is "among dealers we link to"; when the slug lands, the row reappears.
    .filter((r) => r.url !== "")
    .sort((a, b) => a.total - b.total);
}

export default function CompareClient({ spots, dealerUrls }: Props) {
  const [coinId, setCoinId] = useState<CompareCoin["id"]>("silver-eagle");
  const coin = COMPARE_COINS.find((c) => c.id === coinId)!;
  const spot = coin.metal === "gold" ? spots.gold : spots.silver;
  const melt = coin.oz * spot;

  const rows = useMemo(() => buildRows(coin, spots, dealerUrls), [coin, spots, dealerUrls]);
  const best = rows[0];

  // Defensive: if we haven't wired up any dealer slugs for this coin yet,
  // don't crash — show a placeholder. In the current catalog JM Bullion +
  // SD Bullion are always populated, so this path is a guardrail, not a
  // common state.
  if (!best) {
    return (
      <div className="space-y-10">
        <div className="flex flex-wrap gap-2">
          {COMPARE_COINS.map((c) => {
            const active = c.id === coinId;
            return (
              <button
                key={c.id}
                onClick={() => setCoinId(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors border ${
                  active
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                    : "border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20"
                }`}
                style={active ? { borderColor: "rgba(212, 175, 55, 0.4)" } : undefined}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-500">
          Dealer links for {coin.label} are being verified — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Coin picker — pill selector, 4 items, wraps on mobile */}
      <div className="flex flex-wrap gap-2">
        {COMPARE_COINS.map((c) => {
          const active = c.id === coinId;
          return (
            <button
              key={c.id}
              onClick={() => setCoinId(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors border ${
                active
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                  : "border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20"
              }`}
              style={active ? { borderColor: "rgba(212, 175, 55, 0.4)" } : undefined}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Headline — cheapest price right now */}
      <div className="space-y-2">
        <p className="label">Cheapest right now</p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              letterSpacing: "-0.04em",
              color: "var(--gold-bright)",
            }}
          >
            {fmtUSD(best.total)}
          </span>
          <span className="text-sm text-gray-500">
            at <span className="text-white font-semibold">{best.dealerName}</span>
          </span>
        </div>
        <p className="text-xs text-gray-600 tabular-nums">
          Spot melt: {fmtUSD(melt)} · {coin.oz} oz {coin.metal}
        </p>
      </div>

      {/* Sorted dealer list */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {rows.map((r, i) => {
            const isBest = i === 0;
            return (
              <div
                key={r.dealerId}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 sm:py-5"
              >
                {/* Dealer name + premium */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{r.dealerName}</span>
                    {isBest && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full">
                        Best
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 tabular-nums mt-0.5">
                    spot + {fmtUSD(r.premium)} premium
                  </p>
                </div>

                {/* Total price */}
                <div className="text-right tabular-nums">
                  <span className="text-base sm:text-lg font-bold text-white">
                    {fmtUSD(r.total)}
                  </span>
                </div>

                {/* CTA — hidden on small screens, whole row is tappable via link below */}
                <a
                  href={r.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                    isBest
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/30"
                  }`}
                  aria-label={`View ${coin.label} at ${r.dealerName}`}
                  onClick={(e) => {
                    if (!r.url) e.preventDefault();
                  }}
                >
                  View
                </a>

                {/* Mobile CTA — a second full-width link under the row */}
                <a
                  href={r.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="sm:hidden col-span-2 text-[11px] font-bold tracking-wide text-amber-300 hover:text-amber-200"
                  aria-label={`View ${coin.label} at ${r.dealerName}`}
                  onClick={(e) => {
                    if (!r.url) e.preventDefault();
                  }}
                >
                  View at {r.dealerName} →
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footnote */}
      <p className="text-[11px] text-gray-700 leading-relaxed max-w-md">
        Prices update as spot moves. Dealer premiums shown are typical single-piece
        list prices; bulk and wire-transfer discounts may apply at checkout.{" "}
        <Link href="/#calculator" className="underline hover:text-gray-400 transition-colors">
          Calculate melt value →
        </Link>
      </p>
    </div>
  );
}
