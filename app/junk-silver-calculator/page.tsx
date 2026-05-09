export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { formatCurrency } from "@/lib/formatCurrency";
import { JunkSilverCalculator } from "@/components/JunkSilverCalculator";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Junk Silver Calculator — Live Melt Value for 90% Silver Coins",
  description:
    "Free junk silver calculator with live spot prices. Instantly find the melt value of pre-1965 silver dimes, quarters, half dollars, and Morgan & Peace dollars. Enter face value or count by coin.",
  keywords: [
    "junk silver calculator",
    "junk silver melt value",
    "junk silver value calculator",
    "90% silver calculator",
    "pre-1965 silver coin calculator",
    "junk silver per dollar face value",
    "silver dime melt value",
    "silver quarter melt value",
    "how much is junk silver worth",
    "junk silver price today",
    "90 percent silver coin value",
    "face value silver calculator",
  ],
  alternates: {
    canonical: "https://lode.rocks/junk-silver-calculator",
  },
  openGraph: {
    title: "Junk Silver Calculator — Live Melt Value for 90% Silver Coins",
    description:
      "Calculate the melt value of pre-1965 junk silver coins at live spot prices. Dimes, quarters, half dollars, and Morgan dollars. Enter face value or count coin by coin.",
    url: "https://lode.rocks/junk-silver-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",                    "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Junk Silver Calculator",  "item": "https://lode.rocks/junk-silver-calculator" },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/junk-silver-calculator#app",
      "name": "Junk Silver Calculator — Lode",
      "url": "https://lode.rocks/junk-silver-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate the live melt value of pre-1965 junk silver coins. Enter a face value amount or count individual coins — silver dimes, quarters, half dollars (90% and 40%), and Morgan & Peace dollars. Spot prices refresh on every page load.",
      "featureList": [
        "Junk silver face value calculator",
        "Pre-1965 silver dime melt value",
        "90% silver quarter melt value",
        "Walking Liberty and Franklin half dollar melt value",
        "Kennedy half dollar (90% and 40%) melt value",
        "Morgan and Peace silver dollar melt value",
        "Live silver spot price on every page load",
      ],
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver refers to pre-1965 US dimes, quarters, and half dollars that are 90% silver. The term 'junk' doesn't mean low quality — it means no numismatic (collectible) premium. These coins are valued purely for their silver content. Dealers trade them by face value, typically quoting a price per dollar of face value.",
          },
        },
        {
          "@type": "Question",
          "name": "How many troy ounces of silver are in $1 of junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "$1 face value in 90% silver coins contains approximately 0.715 troy ounces of silver. This figure accounts for average coin wear over time. A new, uncirculated coin would contain 0.7234 oz per dollar face value, but 0.715 is the industry-standard figure used by dealers and calculators for circulated junk silver.",
          },
        },
        {
          "@type": "Question",
          "name": "How much silver is in a pre-1965 dime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A pre-1965 Roosevelt or Mercury dime contains 0.07234 troy ounces of silver. Ten dimes ($1 face value) contains 0.7234 troy oz of silver before wear adjustment.",
          },
        },
        {
          "@type": "Question",
          "name": "How much silver is in a pre-1965 quarter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A pre-1965 Washington quarter contains 0.18084 troy ounces of silver. Four quarters ($1 face value) contains 0.7234 troy oz before wear adjustment.",
          },
        },
        {
          "@type": "Question",
          "name": "Are 1965–1970 Kennedy half dollars junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but they're 40% silver, not 90%. Kennedy half dollars minted from 1965 to 1970 contain 0.1479 troy ounces of silver each. Kennedy halves from 1964 are 90% silver (0.3617 oz). Halves from 1971 onward contain no silver.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the melt value of a Morgan silver dollar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Morgan or Peace silver dollar contains 0.77344 troy ounces of silver (90% silver, 26.73g total weight). To find the current melt value, multiply 0.77344 by the live silver spot price.",
          },
        },
        {
          "@type": "Question",
          "name": "Do dealers pay melt value for junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most dealers pay 90–97% of melt value for common 90% silver coins, depending on the dealer, quantity, and current market. Rare dates or coins in exceptional condition may command premiums above melt. When selling large quantities, spot minus a small percentage is typical.",
          },
        },
      ],
    },
  ],
};

export default async function JunkSilverCalculatorPage() {
  const [spots, session] = await Promise.all([
    fetchAllSpotPrices(),
    getServerSession(authOptions),
  ]);
  const isLoggedIn = !!session?.user?.email;

  const silverSpot = spots.silver ?? 0;

  const fmtSpot = (n: number) => (n > 0 ? formatCurrency(n) : "—");

  // Pre-compute reference values for the static table
  const OZ_PER_DOLLAR = 0.715; // industry standard for 90% circulated
  const COINS = [
    { label: "Silver dime (pre-1965)",            asw: 0.07234 },
    { label: "Silver quarter (pre-1965)",          asw: 0.18084 },
    { label: "Half dollar — 90% (pre-1965)",       asw: 0.36169 },
    { label: "Half dollar — 40% (1965–70)",        asw: 0.14792 },
    { label: "Morgan / Peace dollar",              asw: 0.77344 },
    { label: "$1 face value in 90% coins",         asw: OZ_PER_DOLLAR },
    { label: "$10 face value in 90% coins",        asw: OZ_PER_DOLLAR * 10 },
    { label: "$100 face value in 90% coins",       asw: OZ_PER_DOLLAR * 100 },
  ];

  return (
    <>
    <main className="bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #C0C0C0 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Junk Silver<br />
            <span style={{ color: "var(--gold-bright)" }}>Calculator</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto">
            Live melt values for pre-1965 silver dimes, quarters, half dollars, and Morgan &amp; Peace dollars.
            Enter a face value amount or count coin by coin.
          </p>
          {silverSpot > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>Silver spot: <span className="text-gray-400 tabular-nums font-semibold">{fmtSpot(silverSpot)} / ozt</span></span>
            </div>
          )}
        </div>
      </section>

      {/* ── Calculator ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="mx-auto max-w-2xl">
          <JunkSilverCalculator silverSpot={silverSpot} />
        </div>
      </section>

      {/* ── Reference table ──────────────────────────────────────── */}
      {silverSpot > 0 && (
        <section className="px-4 sm:px-6 pb-12">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Today&apos;s junk silver melt values</h2>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div
                className="grid px-5 py-2.5 border-b text-[10px] font-bold uppercase tracking-widest text-gray-600"
                style={{ gridTemplateColumns: "1fr auto auto", borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
              >
                <span>Coin / amount</span>
                <span className="text-right pr-6">Oz silver</span>
                <span className="text-right w-24">Melt value</span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {COINS.map(({ label, asw }) => (
                  <div
                    key={label}
                    className="grid items-center px-5 py-3"
                    style={{ gridTemplateColumns: "1fr auto auto" }}
                  >
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm tabular-nums text-gray-500 text-right pr-6">
                      {asw.toFixed(4)}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-white text-right w-24">
                      {formatCurrency(asw * silverSpot)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-700">
              $1 face value uses 0.715 oz (industry standard for circulated 90% silver). Individual coin figures use actual specified weight.
            </p>
          </div>
        </section>
      )}

      {/* ── Email capture — non-converts only ───────────────────── */}
      {!isLoggedIn && (
        <section className="px-4 sm:px-6 pb-10">
          <div className="mx-auto max-w-2xl">
            <EmailCapture source="junk-silver" />
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 className="text-xl font-black tracking-tight">Common questions</h2>
          <div className="space-y-6">
            {(jsonLd["@graph"][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map((qa) => (
              <div key={qa.name} className="space-y-2">
                <h3 className="text-sm font-bold text-white">{qa.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{qa.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        {isLoggedIn ? (
          <>
            <p className="text-sm text-gray-500">Looking at modern silver coins too?</p>
            <Link href="/coin-melt-calculator" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              See all coins including Silver Eagles and Maple Leafs →
            </Link>
            <p className="text-sm text-gray-500 pt-2">
              Calculating jewelry or scrap?{" "}
              <Link href="/gram" className="text-gray-400 hover:text-gray-200 transition-colors">
                Calculate by gram weight →
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-black tracking-tight">Track your silver stack on Lode</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Portfolio tracker, price alerts, and live spot for gold, silver, platinum &amp; palladium.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="btn-gold px-10 inline-block">
                Get started
              </Link>
              <Link href="/coin-melt-calculator" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                See all coin melt values →
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              Calculating jewelry or scrap?{" "}
              <Link href="/gram" className="text-gray-500 hover:text-gray-300 transition-colors">
                Calculate by gram weight →
              </Link>
            </p>
          </>
        )}
      </section>

      </main>
    <SiteFooter />
  </>
  );
}
