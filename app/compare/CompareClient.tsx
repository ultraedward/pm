"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COMPARE_COINS, type CompareCoin } from "@/lib/compare/coins";
import { DEALERS } from "@/lib/compare/dealers";
import { PREMIUMS } from "@/lib/compare/premiums";

type Spots = { gold: number; silver: number };

// Availability map: { [coinId]: { [dealerId]: hasVerifiedSlug } }. We do
// not precompute outbound URLs in the client — every dealer click routes
// through /api/track/click, which logs the click and 302-redirects to the
// affiliate-wrapped dealer URL. That keeps affiliate IDs server-side and
// gives us a single point of truth for click metrics.
export type DealerAvailabilityMap = Record<string, Record<string, boolean>>;

type Props = { spots: Spots; available: DealerAvailabilityMap };

type Row = {
  dealerId: string;
  dealerName: string;
  short: string;
  trackedUrl: string;
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

function buildRows(coin: CompareCoin, spots: Spots, available: DealerAvailabilityMap): Row[] {
  const spot = coin.metal === "gold" ? spots.gold : spots.silver;
  const melt = coin.oz * spot;
  return DEALERS
    .filter((d) => available[coin.id]?.[d.id])
    .map((d) => {
      const premium = PREMIUMS[coin.id]?.[d.id] ?? 0;
      // Outbound URL is the tracker — the actual dealer URL (with affiliate
      // wrapper + sub-id) is resolved server-side inside /api/track/click.
      const trackedUrl =
        `/api/track/click?coin=${encodeURIComponent(coin.id)}` +
        `&dealer=${encodeURIComponent(d.id)}` +
        `&source=compare`;
      return {
        dealerId: d.id,
        dealerName: d.name,
        short: d.short,
        trackedUrl,
        premium,
        total: melt + premium,
      };
    })
    .sort((a, b) => a.total - b.total);
}

export default function CompareClient({ spots, available }: Props) {
  const [coinId, setCoinId] = useState<CompareCoin["id"]>("silver-eagle");
  const coin = COMPARE_COINS.find((c) => c.id === coinId)!;
  const spot = coin.metal === "gold" ? spots.gold : spots.silver;
  const melt = coin.oz * spot;

  const rows = useMemo(() => buildRows(coin, spots, available), [coin, spots, available]);
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

      {/* Headline — cheapest price right now.
          We show three lines of meaning under the price:
            1. Where it is (dealer name)
            2. How much you save vs. the most expensive of the dealers we
               ranked — anchors the value of using the comparison rather
               than going direct to a dealer the user already knows
            3. Spot melt — for users who care about the over-spot premium */}
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
        {rows.length > 1 && rows[rows.length - 1].total > best.total && (
          <p className="text-xs text-emerald-400 tabular-nums font-semibold">
            {fmtUSD(rows[rows.length - 1].total - best.total)} less than the
            most expensive of {rows.length} dealers
          </p>
        )}
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
                {/* Dealer name + premium + report-wrong affordance.
                    The "Report wrong" link is a mailto with a pre-filled
                    subject so corrections land in the inbox already
                    routed. Cheap to add, signals that we care about
                    accuracy, and turns adversarial users (skeptics) into
                    collaborators (correctors). Hidden until row hover so
                    it doesn't compete with the primary CTA. */}
                <div className="min-w-0 group/row">
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
                    <a
                      href={`mailto:hello@lode.rocks?subject=${encodeURIComponent(
                        `Premium discrepancy — ${coin.label} at ${r.dealerName}`
                      )}&body=${encodeURIComponent(
                        `Coin: ${coin.label}\nDealer: ${r.dealerName}\nPremium shown on Lode: $${r.premium.toFixed(2)}\nWhat you saw at checkout: \n\nNotes: `
                      )}`}
                      className="ml-2 text-gray-700 hover:text-gray-400 underline underline-offset-2 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity"
                    >
                      Report wrong
                    </a>
                  </p>
                </div>

                {/* Total price */}
                <div className="text-right tabular-nums">
                  <span className="text-base sm:text-lg font-bold text-white">
                    {fmtUSD(r.total)}
                  </span>
                </div>

                {/* CTA — hidden on small screens, whole row is tappable via link below.
                    Both CTAs point at /api/track/click, which logs the click and
                    302-redirects to the dealer's (affiliate-wrapped) product page. */}
                <a
                  href={r.trackedUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                    isBest
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/30"
                  }`}
                  aria-label={`View ${coin.label} at ${r.dealerName}`}
                >
                  View
                </a>

                {/* Mobile CTA — a second full-width link under the row */}
                <a
                  href={r.trackedUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="sm:hidden col-span-2 text-[11px] font-bold tracking-wide text-amber-300 hover:text-amber-200"
                  aria-label={`View ${coin.label} at ${r.dealerName}`}
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
