export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { CoinMeltTable } from "@/components/CoinMeltTable";
import { EmailCapture } from "@/components/EmailCapture";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

export const metadata: Metadata = {
  title: "Coin Melt Value Calculator — Silver Eagles, Junk Silver & More",
  description:
    "Calculate the melt value of silver and gold coins at live spot prices. Covers American Silver Eagles, Maple Leafs, pre-1965 junk silver (dimes, quarters, halves), Morgan dollars, and gold Eagles.",
  keywords: [
    "coin melt value calculator",
    "silver coin melt value",
    "junk silver melt value",
    "silver eagle melt value",
    "gold coin melt value",
    "pre-1965 silver melt value",
    "morgan dollar melt value",
    "gold eagle melt value",
    "silver dollar melt value calculator",
    "precious metals melt calculator",
  ],
  alternates: {
    canonical: "https://lode.rocks/coin-melt-calculator",
  },
  openGraph: {
    title: "Coin Melt Value Calculator — Silver Eagles, Junk Silver & More",
    description:
      "Instantly calculate the melt value of silver and gold coins at live spot prices. Eagles, Maple Leafs, junk silver, Morgan dollars, and more.",
    url: "https://lode.rocks/coin-melt-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",                 "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Coin Melt Calculator", "item": "https://lode.rocks/coin-melt-calculator" },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/coin-melt-calculator#app",
      "name": "Coin Melt Value Calculator — Lode",
      "url": "https://lode.rocks/coin-melt-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate the melt value of silver and gold coins at live spot prices. Covers American Silver Eagles, Maple Leafs, pre-1965 junk silver, Morgan dollars, and gold coins.",
      "featureList": [
        "American Silver Eagle melt value",
        "Junk silver melt value (pre-1965 dimes, quarters, halves)",
        "Morgan and Peace dollar melt value",
        "Gold Eagle melt value",
        "Canadian Maple Leaf melt value",
        "Live spot price on every page load",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the melt value of a silver dollar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Morgan and Peace silver dollars contain 0.7734 troy ounces of silver (90% silver, 10% copper, 26.73g total weight). To find the melt value, multiply 0.7734 by the current silver spot price.",
          },
        },
        {
          "@type": "Question",
          "name": "How much silver is in pre-1965 junk silver coins?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pre-1965 US dimes, quarters, and half dollars are 90% silver. A dime contains 0.0723 troy oz, a quarter 0.1808 troy oz, and a half dollar 0.3617 troy oz. A $1 face value in 90% silver holds about 0.715 troy oz of silver.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the melt value of an American Silver Eagle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An American Silver Eagle contains exactly 1 troy ounce of fine (.999) silver. Its melt value equals the current silver spot price.",
          },
        },
      ],
    },
  ],
};

export default async function CoinMeltCalculatorPage() {
  const spots = await fetchAllSpotPrices();

  const silverPrice = spots.silver ?? 0;
  const goldPrice   = spots.gold   ?? 0;
  const updatedAt   = silverPrice > 0 ? new Date().toISOString() : null;

  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Coin Melt Value<br />
            <span style={{ color: "var(--gold-bright)" }}>Calculator</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Live melt values for common silver and gold coins. Enter a quantity on any row to total your stack.
          </p>
        </div>
      </section>

      {/* ── Interactive melt table ─────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl">
          <CoinMeltTable
            spots={{ silver: silverPrice, gold: goldPrice }}
            updatedAt={updatedAt}
          />
        </div>
      </section>

      {/* ── Email capture ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="mx-auto max-w-2xl">
          <EmailCapture source="coin-melt" />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 className="text-2xl font-black tracking-tight text-center">Common questions</h2>
          <div className="space-y-6">
            {(jsonLd["@graph"][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map((qa) => (
              <div key={qa.name} className="space-y-2">
                <p className="font-bold text-white">{qa.name}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{qa.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Know what your stack is worth — right now</p>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
          Live spot prices, price alerts, and portfolio tracker.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="btn-gold px-10">
            Get started free
          </Link>
          <Link href="/gram" className="text-sm transition-colors hover:text-gray-300" style={{ color: "var(--text-dim)" }}>
            Calculate by gram weight →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
