export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { COMPARE_COINS } from "@/lib/compare/coins";
import { DEALERS, buildDealerUrl } from "@/lib/compare/dealers";
import CompareClient, { type DealerUrlMap } from "./CompareClient";

// Structured data for /compare. We intentionally avoid Product/Offer schema
// because Lode is not the seller — dealers are — and our totals are estimates
// (live spot × coin weight + hand-maintained dealer premiums), not scraped
// live prices. Claiming Offer markup would risk misrepresentation and fall
// outside Google's product-structured-data policy. Instead we emit:
//   1. WebPage — identifies the page + describes it
//   2. BreadcrumbList — Home → Compare
//   3. ItemList — the four coins we track, each as a neutral Thing
// Together these help Google understand topic and hierarchy without
// overclaiming inventory or fulfillment.
const compareJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/compare#page",
      "url": "https://lode.rocks/compare",
      "name": "Estimated Bullion Pricing Across Top US Dealers — Silver & Gold Eagle, Maple Leaf",
      "description":
        "Estimated total cost per coin across top US bullion dealers, using today's live spot price plus dealer premiums we maintain by hand.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",    "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://lode.rocks/compare" },
      ],
    },
    {
      "@type": "ItemList",
      "name": "Bullion coins compared",
      "itemListElement": COMPARE_COINS.map((coin, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Thing",
          "name": coin.label,
          "description": `${coin.oz} troy oz ${coin.metal} bullion coin — estimated cost across top US dealers.`,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "Compare Bullion Prices Across Top US Dealers — Silver & Gold Eagle, Maple Leaf",
  description:
    "Estimated total cost for the most-bought bullion coins — Silver Eagle, Gold Eagle, Silver and Gold Maple Leaf — across APMEX, JM Bullion, SD Bullion, and Money Metals at today's live spot price.",
  alternates: {
    canonical: "https://lode.rocks/compare",
  },
  openGraph: {
    title: "Compare Bullion Prices Across Top US Dealers — Lode",
    description:
      "Estimated pricing for Silver Eagle, Gold Eagle, Silver Maple, and Gold Maple across top US bullion dealers. Live spot plus dealer premiums we track by hand.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareJsonLd) }}
      />
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-14 pb-4 sm:pt-20">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="label">Estimated dealer pricing</p>
          <h1
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.04em", lineHeight: "1.02" }}
          >
            Likely cheapest,<br />
            <span style={{ color: "var(--gold-bright)" }}>at today&rsquo;s spot.</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Estimated total cost per coin across APMEX, JM Bullion, SD Bullion, and Money Metals — today&rsquo;s live spot price plus dealer premiums we maintain by hand. Sorted low to high.
          </p>
          {/* FTC affiliate disclosure — required for sponsored outbound links */}
          <p className="text-xs text-gray-500 leading-relaxed">
            Dealer links on this page are affiliate links. Lode may earn a commission if you buy — at no extra cost to you. Prices and rankings are not influenced by affiliate relationships.
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
