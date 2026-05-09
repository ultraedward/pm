export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { COMPARE_COINS } from "@/lib/compare/coins";
import { DEALERS } from "@/lib/compare/dealers";
import { PREMIUMS_LAST_REVIEWED } from "@/lib/compare/premiums";
import CompareClient, { type DealerAvailabilityMap } from "./CompareClient";

// Render PREMIUMS_LAST_REVIEWED ("YYYY-MM-DD") as a human-friendly date.
// We intentionally avoid showing relative time ("3 days ago") because it
// re-renders on every load and a relative timestamp that ticks past
// "1 week ago" silently degrades the trust signal — an absolute date
// always shows the actual review cadence.
function fmtPremiumsReviewed(iso: string): string {
  // Append a fixed UTC time so server + client format it identically and
  // we don't trip Next.js hydration warnings if the visitor's local TZ
  // happens to push the date back by a day.
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

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
  title: "Compare Silver & Gold Bullion Prices — APMEX vs JM Bullion vs SD Bullion",
  description:
    "Compare Silver Eagle, Gold Eagle, and Maple Leaf prices across APMEX, JM Bullion, SD Bullion, and Money Metals at today's live spot. Sorted by total cost — see who's cheapest right now.",
  alternates: {
    canonical: "https://lode.rocks/compare",
  },
  keywords: [
    "compare silver bullion dealers",
    "cheapest place to buy silver eagles",
    "APMEX vs JM Bullion",
    "SD Bullion vs APMEX",
    "gold eagle price comparison",
    "silver dealer premium comparison",
    "buy silver cheapest dealer",
    "bullion dealer comparison",
    "silver maple leaf price comparison",
    "where to buy silver online cheapest",
  ],
  openGraph: {
    title: "Compare Silver & Gold Bullion Prices — APMEX vs JM Bullion vs SD Bullion",
    description:
      "See who's cheapest for Silver Eagles, Gold Eagles, and Maple Leafs right now. Live spot plus hand-verified dealer premiums, sorted low to high.",
    url: "https://lode.rocks/compare",
  },
};

// Build a sparse coin × dealer availability map. The client only needs to
// know which combos have a verified product slug (so we can hide rows that
// don't); the actual outbound URL is resolved server-side inside
// /api/track/click, which keeps affiliate IDs and the URL-construction
// logic out of the client bundle entirely.
function buildAvailability(): DealerAvailabilityMap {
  const map: DealerAvailabilityMap = {};
  for (const coin of COMPARE_COINS) {
    map[coin.id] = {};
    for (const d of DEALERS) {
      map[coin.id][d.id] = !!coin.slugs[d.id];
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
  const available = buildAvailability();

  return (
    <>
    <main className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
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

          {/* Freshness + verify strip. Two trust micro-signals at the top of
              the conversion screen:
                • Spot prices are live (with an out-link to a third-party
                  reference so the user can sanity-check us in one click)
                • Dealer premiums are hand-verified, with the actual date
                  rather than a vague "regularly updated" claim. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              <span>Live spot price</span>
              <span className="text-gray-700">·</span>
              <a
                href="https://www.kitco.com/charts/livegold.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-300 transition-colors"
              >
                cross-check at Kitco
              </a>
            </span>
            <span className="text-gray-700">·</span>
            <span>
              Dealer premiums verified{" "}
              <span className="text-gray-300">{fmtPremiumsReviewed(PREMIUMS_LAST_REVIEWED)}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Compare ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-6 pb-10">
        <div className="mx-auto max-w-2xl">
          <CompareClient spots={spots} available={available} />
        </div>
      </section>

      {/* ── Editorial — server-rendered for indexability ───────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-10 text-sm text-gray-400 leading-relaxed">

          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">How to compare bullion dealer prices</h2>
            <p>
              The sticker price on a dealer&rsquo;s website is not the real comparison point — the{" "}
              <strong className="text-white">premium over spot</strong> is. Every dealer charges spot price
              plus a markup that covers their minting costs, storage, shipping, and margin. A dealer advertising
              a low per-coin price may still be more expensive overall if their premium is higher. This page
              calculates total estimated cost as:{" "}
              <em>live spot × coin weight + dealer premium</em>, then sorts low to high so the cheapest
              option is always at the top.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">About the dealers we track</h2>
            <p>
              <strong className="text-white">APMEX</strong> (American Precious Metals Exchange) is one of
              the largest US bullion dealers by volume, with a wide coin and bar selection. Premiums tend to
              run slightly higher than discount competitors, but product availability and customer service are
              consistently strong.
            </p>
            <p>
              <strong className="text-white">JM Bullion</strong> is a popular online dealer known for
              competitive silver premiums and free shipping on orders over a minimum. Frequently among the
              cheapest for American Silver Eagles and silver Maple Leafs.
            </p>
            <p>
              <strong className="text-white">SD Bullion</strong> competes aggressively on price, particularly
              for generic silver rounds and junk silver, but also carries Eagles and Maples. Worth checking
              when buying larger quantities.
            </p>
            <p>
              <strong className="text-white">Money Metals Exchange</strong> is a subscription-friendly dealer
              with a recurring purchase program. Premiums are competitive and they carry an unusually broad
              range of fractional gold coins.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">What affects the premium you pay?</h2>
            <p>
              Premiums vary by coin type, quantity, and payment method. Government-minted coins (Silver Eagles,
              Gold Eagles, Maple Leafs) carry higher premiums than privately minted rounds or bars because of
              the added minting and distribution costs. Buying in larger quantities — a full monster box of
              500 Silver Eagles, for example — typically reduces the per-coin premium. Paying by check or bank
              wire instead of credit card usually saves another 3–4% that dealers charge to offset card
              processing fees.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">How Lode maintains premium data</h2>
            <p>
              Dealer premiums are not scraped automatically — they are reviewed by hand and updated when
              dealers change their pricing. The "premiums verified" date shown at the top of the page is the
              last time we checked each dealer&rsquo;s current prices. Live spot prices update on every page
              load from Yahoo Finance futures data, so the estimated totals are always based on the current
              market price even if the premium was last verified a few days ago.
            </p>
            <p>
              If you notice a dealer&rsquo;s actual price is meaningfully different from our estimate, email
              us at{" "}
              <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">
                hello@lode.rocks
              </a>{" "}
              and we&rsquo;ll update it.
            </p>
          </div>

        </div>
      </section>

      </main>
    <SiteFooter />
  </>
  );
}
