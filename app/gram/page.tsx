export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { GramCalculator } from "@/components/GramCalculator";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Sterling Silver Price Per Gram Calculator — Live Spot",
  description:
    "Calculate sterling silver price per gram instantly with live spot prices — .999 fine, 925 sterling, coin 900, European 800. Also covers 14k, 18k, and 24k gold price per gram.",
  alternates: {
    canonical: "https://lode.rocks/gram",
  },
  keywords: [
    "silver price per gram",
    "silver price per gram calculator",
    "silver price per gram today",
    "gold price per gram",
    "gold price per gram calculator",
    "sterling silver price per gram",
    "925 silver price per gram",
    "14k gold price per gram",
    "18k gold price per gram",
    "silver melt value calculator",
    "how much is silver worth per gram",
    "gold price grams calculator",
  ],
  openGraph: {
    title: "Sterling Silver Price Per Gram Calculator — Live Spot",
    description:
      "Instantly calculate silver and gold price per gram with live spot prices. Covers .999 fine, sterling 925, coin 900, and 14k–24k gold.",
    url: "https://lode.rocks/gram",
  },
};

export default async function GramPage() {
  const [spots, session] = await Promise.all([
    fetchAllSpotPrices(),
    getServerSession(authOptions),
  ]);
  const isLoggedIn = !!session?.user?.email;

  const goldSpot   = spots.gold   ?? 0;
  const silverSpot = spots.silver ?? 0;

  const fmtSpot = (n: number) =>
    n > 0
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "—";

  // Pre-computed reference table rows
  const GOLD_KARATS = [
    { label: "24k (99.9%)", purity: 1.0      },
    { label: "22k (91.7%)", purity: 22 / 24  },
    { label: "18k (75.0%)", purity: 18 / 24  },
    { label: "14k (58.3%)", purity: 14 / 24  },
    { label: "10k (41.7%)", purity: 10 / 24  },
    { label: "9k (37.5%)",  purity:  9 / 24  },
  ];

  const SILVER_PURITIES = [
    { label: "Fine .999",     purity: 0.999 },
    { label: "Britannia .958",purity: 0.958 },
    { label: "Sterling 925",  purity: 0.925 },
    { label: "Coin 900",      purity: 0.900 },
    { label: "European 800",  purity: 0.800 },
  ];

  const TROY_PER_GRAM = 1 / 31.1035;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",               "item": "https://lode.rocks" },
          { "@type": "ListItem", "position": 2, "name": "Price Per Gram",     "item": "https://lode.rocks/gram" },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://lode.rocks/gram#app",
        "name": "Silver & Gold Price Per Gram Calculator",
        "url": "https://lode.rocks/gram",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate the live melt value of silver and gold by weight. Supports grams, pennyweights, and troy ounces. Covers sterling .925, fine .999, coin .900 silver, and 24k through 9k gold.",
        "featureList": [
          "Live silver price per gram",
          "Live gold price per gram",
          "Sterling silver melt value",
          "14k, 18k, 24k gold melt value",
          "Gram, pennyweight, and troy oz support",
        ],
        "isPartOf": { "@id": "https://lode.rocks/#site" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the silver price per gram today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Silver is currently ${silverSpot > 0 ? `$${(silverSpot / 31.1035).toFixed(4)} per gram` : "available on this page — calculated from live spot prices"}. Fine .999 silver is calculated by dividing the troy ounce spot price by 31.1035 grams per troy oz.`,
            },
          },
          {
            "@type": "Question",
            "name": "How much is sterling silver worth per gram?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sterling silver is 92.5% pure silver. At today's spot price${silverSpot > 0 ? `, sterling silver is worth approximately $${(silverSpot * 0.925 / 31.1035).toFixed(4)} per gram` : " — use the calculator above for the current value"}. Multiply the fine silver price per gram by 0.925 to get the sterling melt value.`,
            },
          },
          {
            "@type": "Question",
            "name": "What is the gold price per gram for 14k gold?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `14k gold is 58.3% pure (14 ÷ 24). ${goldSpot > 0 ? `At today's spot price, 14k gold is worth approximately $${(goldSpot * (14/24) / 31.1035).toFixed(2)} per gram.` : "Use the calculator above to see the current 14k gold price per gram based on live spot prices."}`,
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Silver Price Per Gram<br />
            <span style={{ color: "var(--gold-bright)" }}>Calculator</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto">
            Enter any weight to see the live melt value of silver or gold — fine .999, sterling 925, coin 900, 14k, 18k, 24k, and more. Spot prices refresh on page load.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-1">
            <span>Gold spot: <span className="text-gray-400 tabular-nums font-semibold">{fmtSpot(goldSpot)} / ozt</span></span>
            <span>Silver spot: <span className="text-gray-400 tabular-nums font-semibold">{fmtSpot(silverSpot)} / ozt</span></span>
          </div>
        </div>
      </section>

      {/* ── Calculator + Reference tables ────────────────────────── */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-2xl">
          <GramCalculator spots={{ gold: goldSpot, silver: silverSpot }} />
        </div>

        <div className="mx-auto max-w-4xl space-y-6 mt-12">
          <h2 className="text-xl font-black tracking-tight text-center">Price per gram — today&apos;s rates</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Gold table */}
            {goldSpot > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Gold</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {GOLD_KARATS.map(({ label, purity }) => {
                    const perGram = goldSpot * TROY_PER_GRAM * purity;
                    return (
                      <div key={label} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-gray-400">{label}</span>
                        <span className="text-sm font-bold tabular-nums text-white">
                          {perGram.toLocaleString("en-US", { style: "currency", currency: "USD" })}/g
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Silver table */}
            {silverSpot > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Silver</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {SILVER_PURITIES.map(({ label, purity }) => {
                    const perGram = silverSpot * TROY_PER_GRAM * purity;
                    return (
                      <div key={label} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-gray-400">{label}</span>
                        <span className="text-sm font-bold tabular-nums text-white">
                          {perGram.toLocaleString("en-US", { style: "currency", currency: "USD" })}/g
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Email capture — non-converts only.
          Logged-in users gave us their email at signup; re-prompting
          them under their own tool is awkward. ─────────────────────── */}
      {!isLoggedIn && (
        <section className="px-4 sm:px-6 pb-10">
          <div className="mx-auto max-w-2xl">
            <EmailCapture source="gram" />
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-16" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 className="text-xl font-black tracking-tight">Common questions</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">What is the silver price per gram today?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {silverSpot > 0
                  ? `Fine .999 silver is currently ${(silverSpot / 31.1035).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 4 })} per gram, based on a spot price of ${fmtSpot(silverSpot)} per troy ounce. Sterling silver (92.5% pure) is ${(silverSpot * 0.925 / 31.1035).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 4 })} per gram.`
                  : "The current silver price per gram is shown in the calculator and reference table above, calculated from the live spot price."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">How much is sterling silver worth per gram?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sterling silver is 92.5% pure silver (marked &quot;925&quot;).
                {silverSpot > 0
                  ? ` At today's spot price, sterling silver is worth ${(silverSpot * 0.925 / 31.1035).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 4 })} per gram. To calculate it yourself: multiply the fine silver price per gram by 0.925.`
                  : " To calculate: multiply the fine .999 silver price per gram by 0.925. The calculator above does this automatically."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">What is the gold price per gram for 14k gold?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                14k gold is 58.3% pure (14 ÷ 24 karats).
                {goldSpot > 0
                  ? ` At today's spot price of ${fmtSpot(goldSpot)} per troy oz, 14k gold is worth ${(goldSpot * (14/24) / 31.1035).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })} per gram.`
                  : " The current 14k gold price per gram is in the reference table above."}
                {" "}18k gold (75% pure) and 24k gold (99.9% pure) are in the table as well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — sign-up pitch for non-converts; cross-sell for users.
          Logged-in users see only the /compare pointer (a high-intent
          monetized surface), not the sign-up pitch they've already
          completed. ───────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        {isLoggedIn ? (
          <>
            <p className="text-sm text-gray-500">
              Looking to buy?
            </p>
            <Link href="/compare" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              See the cheapest dealer at today&apos;s spot →
            </Link>
            <p className="text-sm text-gray-500 pt-2">
              Have coins?{" "}
              <Link href="/coin-melt-calculator" className="text-gray-400 hover:text-gray-200 transition-colors">
                Calculate coin melt values →
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-black tracking-tight">Track your full stack on Lode</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">Portfolio tracker, price alerts, and live spot for gold, silver, platinum &amp; palladium.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="btn-gold px-10 inline-block">
                Get started
              </Link>
              <Link href="/compare" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                See where to buy at today&apos;s spot →
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              Have coins?{" "}
              <Link href="/coin-melt-calculator" className="text-gray-500 hover:text-gray-300 transition-colors">
                Calculate coin melt values →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <SiteFooter />
    </main>
  );
}
