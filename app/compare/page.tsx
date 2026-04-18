export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { COMPARE_COINS } from "@/lib/compare/coins";
import { DEALERS, buildDealerUrl } from "@/lib/compare/dealers";
import CompareClient, { type DealerUrlMap } from "./CompareClient";

export const metadata: Metadata = {
  title: "Cheapest Place to Buy Bullion Right Now — Silver & Gold Eagle, Maple Leaf",
  description:
    "Compare live dealer prices on the most-bought bullion coins. Find the cheapest American Silver Eagle, Gold Eagle, and Canadian Maple Leaf across top US dealers at today's spot price.",
  alternates: {
    canonical: "https://lode.rocks/compare",
  },
  openGraph: {
    title: "Cheapest Place to Buy Bullion Right Now — Lode",
    description:
      "Live price comparison across top US bullion dealers. Silver Eagle, Gold Eagle, Silver Maple, Gold Maple — sorted by cheapest right now.",
    url: "https://lode.rocks/compare",
  },
};

// Build the coin × dealer URL map server-side. Affiliate IDs come from
// process.env (see lib/compare/dealers.ts) and must never ship in the client
// bundle, so we resolve fully-qualified outbound URLs here and pass only the
// strings down.
function buildDealerUrls(): DealerUrlMap {
  const map: DealerUrlMap = {};
  for (const coin of COMPARE_COINS) {
    map[coin.id] = {};
    for (const d of DEALERS) {
      map[coin.id][d.id] = buildDealerUrl(d, coin.slugs[d.id]);
    }
  }
  return map;
}

export default async function ComparePage() {
  const live = await fetchAllSpotPrices();
  const spots = {
    gold:   live.gold   ?? 0,
    silver: live.silver ?? 0,
  };
  const dealerUrls = buildDealerUrls();

  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-14 pb-4 sm:pt-20">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="label">Price comparison</p>
          <h1
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.04em", lineHeight: "1.02" }}
          >
            Cheapest place to buy,<br />
            <span style={{ color: "var(--gold-bright)" }}>right now.</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Live dealer prices on the four most-bought bullion coins. Sorted by total cost.
          </p>
          {/* FTC affiliate disclosure — required for sponsored outbound links */}
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Lode may earn a commission when you buy through dealer links on this page. Prices and rankings are not affected.
          </p>
        </div>
      </section>

      {/* ── Compare ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <CompareClient spots={spots} dealerUrls={dealerUrls} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
