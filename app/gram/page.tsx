export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { GramCalculator } from "@/components/GramCalculator";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Silver & Gold Price Per Gram Calculator — Live Spot",
  description:
    "Instant silver price per gram — updated with live spot prices. Calculate the melt value of sterling, coin silver, and fine .999 silver by gram, pennyweight, or troy oz. Also covers 24k–9k gold.",
  alternates: {
    canonical: "https://lode.rocks/gram",
  },
  keywords: [
    "silver price per gram",
    "silver price per gram calculator",
    "gold price per gram",
    "gold price per gram calculator",
    "silver melt value calculator",
    "gold melt value",
    "sterling silver price per gram",
    "14k gold price per gram",
    "18k gold price per gram",
    "precious metals calculator",
  ],
  openGraph: {
    title: "Silver Price Per Gram Calculator — Live Spot Price",
    description:
      "Instantly see the silver price per gram for .999, sterling 925, coin 900, and more — plus 24k through 9k gold. Live spot prices updated every 15 minutes.",
    url: "https://lode.rocks/gram",
  },
};

export default async function GramPage() {
  const spots = await fetchAllSpotPrices();

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
        "isPartOf": { "@id": "https://lode.rocks/#website" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the silver price per gram today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Silver is currently ${silverSpot > 0 ? `$${(silverSpot / 31.1035).toFixed(4)} per gram` : "available on this page — updated with live spot prices every 15 minutes"}. Fine .999 silver is calculated by dividing the troy ounce spot price by 31.1035 grams per troy oz.`,
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
            "name": "How do I calculate the melt value of silver jewelry?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To calculate silver melt value: (1) weigh the item in grams, (2) identify the purity — .999 fine, .925 sterling, .900 coin silver, or .800 European silver, (3) multiply grams × purity × (spot price ÷ 31.1035). The calculator above does this automatically with live spot prices.",
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
          {
            "@type": "Question",
            "name": "How many grams are in a troy ounce of silver?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There are exactly 31.1035 grams in one troy ounce. Troy ounces are the standard unit for precious metals pricing. To convert a spot price quoted per troy oz to price per gram, divide by 31.1035.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
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
            Silver & Gold<br />
            <span style={{ color: "var(--gold-bright)" }}>Price Per Gram</span>
          </h1>
          <p className="text-base text-gray-400 max-w-md mx-auto">
            Live silver price per gram — plus 24k–9k gold. Calculate melt value by gram, pennyweight, or troy oz.
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

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Track your full stack on Lode</p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Sign in to track
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <SiteFooter />
    </main>
  );
}
