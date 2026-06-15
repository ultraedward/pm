export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { InlineSignup } from "@/components/InlineSignup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";
import { CoinMeltTable } from "@/components/CoinMeltTable";
import { EmailCapture } from "@/components/EmailCapture";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

export const metadata: Metadata = {
  title: "Silver Coin Melt Value Calculator — Dimes, Quarters, Dollars & Eagles",
  description:
    "Free silver coin melt value calculator with live spot prices. Instantly find melt values for silver dimes, quarters, half dollars, Morgan dollars, American Silver Eagles, Canadian Maple Leafs, and gold coins.",
  keywords: [
    "silver coin melt value calculator",
    "silver dime melt value calculator",
    "silver quarter melt value calculator",
    "silver dollar melt value calculator",
    "coin melt value calculator",
    "junk silver melt value calculator",
    "silver eagle melt value",
    "gold coin melt value",
    "pre-1965 silver melt value",
    "morgan dollar melt value",
    "gold eagle melt value",
    "scrap coin silver calculator",
    "90 silver coins calculator",
  ],
  alternates: {
    canonical: "https://lode.rocks/coin-melt-calculator",
  },
  openGraph: {
    title: "Silver Coin Melt Value Calculator — Dimes, Quarters, Dollars & Eagles",
    description:
      "Instantly calculate the melt value of silver and gold coins at live spot prices. Dimes, quarters, half dollars, Morgan dollars, Silver Eagles, and more.",
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
        {
          "@type": "Question",
          "name": "What is the melt value of a 90% silver dime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A pre-1965 US silver dime (Roosevelt or Mercury) contains 0.0723 troy ounces of silver. Multiply 0.0723 by the current silver spot price to get the melt value. At a $30 spot price, a silver dime is worth about $2.17 in melt value.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I calculate junk silver melt value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver refers to pre-1965 US dimes, quarters, and half dollars that are 90% silver. To calculate melt value: multiply the face value in dollars by 0.715 (troy ounces of silver per $1 face value) then multiply by the spot price. For example, $1 face value in junk silver × 0.715 × spot price = melt value. The calculator above does this automatically.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the melt value of a silver quarter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A pre-1965 Washington silver quarter contains 0.18084 troy ounces of silver (90% silver, 6.25g total weight). To find its melt value, multiply 0.18084 by the current silver spot price. At a $32 spot price, a silver quarter is worth about $5.79 in silver melt value. Four quarters ($1 face value) contain 0.7234 troy oz before wear adjustment.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the melt value of a Mexican silver coin?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mexico has minted several silver coins across different eras. The modern Mexican Silver Libertad (1 oz .999 fine silver) has a melt value equal to the silver spot price — the same as an American Silver Eagle. The historic Mexican Onza (1 troy oz .925 silver) is worth spot × 0.925. Older Mexican pesos vary significantly: the large 8 Reales and peso coins from the late 1800s to 1918 are 90% silver. Identify the specific coin's year, denomination, and fineness to calculate the exact melt value — then multiply the silver content in troy ounces by the current spot price.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the scrap value of a silver coin?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The scrap or melt value of a silver coin is the intrinsic value of its silver content at current spot prices. It differs from the coin's numismatic (collectible) value. To find scrap value: fine troy oz content × spot price per troy oz. Dealers typically pay 90–95% of melt value when buying scrap silver.",
          },
        },
      ],
    },
  ],
};

export default async function CoinMeltCalculatorPage() {
  const [spots, session] = await Promise.all([
    fetchAllSpotPrices(),
    getServerSession(authOptions),
  ]);
  const isLoggedIn = !!session?.user?.email;

  const silverPrice = spots.silver ?? 0;
  const goldPrice   = spots.gold   ?? 0;
  const updatedAt   = silverPrice > 0 ? new Date().toISOString() : null;

  return (
    <>
    <main className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
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
            Live melt values for pre-1965 junk silver (dimes, quarters, half dollars), American Silver Eagles, Morgan &amp; Peace dollars, Canadian Maple Leafs, and gold coins. Enter a quantity on any row to total your stack.
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

      {/* ── Editorial: live melt value breakdowns ─────────────────── */}
      {silverPrice > 0 && (
        <section className="border-t px-4 sm:px-6 py-12" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl space-y-10 text-sm text-gray-400 leading-relaxed">

            <div className="space-y-3">
              <h2 className="text-base font-black text-white tracking-tight">Silver dime melt value today</h2>
              <p>
                A pre-1965 Roosevelt or Mercury dime is <strong className="text-white">90% silver</strong> with a gross weight of 2.5 grams (0.07234 troy oz of pure silver).
                At today&apos;s silver spot price of <span className="text-white font-semibold tabular-nums">${(silverPrice).toFixed(2)}/ozt</span>,
                one silver dime has a melt value of{" "}
                <span className="text-white font-bold tabular-nums">${(0.07234 * silverPrice).toFixed(2)}</span>.
                A roll of 50 silver dimes ($5 face value) contains approximately 3.617 troy oz of silver — melt value <span className="text-white font-semibold tabular-nums">${(3.617 * silverPrice).toFixed(2)}</span>.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white tracking-tight">Silver quarter melt value today</h2>
              <p>
                Pre-1965 Washington quarters are <strong className="text-white">90% silver</strong>, 6.25g gross (0.18084 troy oz fine silver each).
                At today&apos;s spot price, a silver quarter&apos;s melt value is{" "}
                <span className="text-white font-bold tabular-nums">${(0.18084 * silverPrice).toFixed(2)}</span>.
                A roll of 40 quarters ($10 face value) contains 7.234 troy oz — melt value <span className="text-white font-semibold tabular-nums">${(7.234 * silverPrice).toFixed(2)}</span>.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white tracking-tight">Silver dollar melt value today</h2>
              <p>
                Morgan and Peace silver dollars are <strong className="text-white">90% silver</strong>, 26.73g gross (0.77344 troy oz fine silver each).
                At today&apos;s spot price, one Morgan or Peace dollar has a melt value of{" "}
                <span className="text-white font-bold tabular-nums">${(0.77344 * silverPrice).toFixed(2)}</span>.
                Note: numismatic premiums on common-date Morgans typically add $15–$40 above melt. The calculator above shows melt value only.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white tracking-tight">American Silver Eagle melt value today</h2>
              <p>
                The American Silver Eagle (ASE) contains exactly <strong className="text-white">1 troy oz of .999 fine silver</strong>.
                Its melt value equals the silver spot price: <span className="text-white font-bold tabular-nums">${silverPrice.toFixed(2)}</span>.
                ASEs typically trade at a $3–$8 premium over melt (dealer-dependent), so expect to pay more to buy and receive slightly less than melt when selling.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white tracking-tight">What is coin melt value?</h2>
              <p>
                Melt value is the intrinsic worth of a coin&apos;s metal content at current spot prices — calculated as <span className="text-white">(fine troy oz content) × (spot price per troy oz)</span>.
                It&apos;s the floor value: what the metal itself is worth if the coin were melted down. Actual sale prices almost always carry a premium above melt for bullion coins, and can be significantly higher for numismatic pieces.
                For junk silver (circulated pre-1965 US coins), dealers typically pay 90–97% of melt, depending on quantity and current demand.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* ── Email capture — non-converts only.
          Logged-in users already gave us their email at signup; prompting
          them again under their own tool is awkward. ───────────────── */}
      {!isLoggedIn && (
        <section className="px-4 sm:px-6 pb-10">
          <div className="mx-auto max-w-2xl">
            <EmailCapture source="coin-melt" />
          </div>
        </section>
      )}

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

      {/* ── CTA — sign-up pitch for non-converts; cross-sell for users.
          For logged-in users we keep the section but swap the sign-up
          pitch for a quiet pointer to the gram calculator. They came
          here for a tool, not a marketing pitch. ───────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        {isLoggedIn ? (
          <>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Calculating jewelry or scrap?
            </p>
            <Link href="/gram" className="text-sm transition-colors hover:text-gray-300" style={{ color: "var(--text-muted)" }}>
              Calculate by gram weight →
            </Link>
            <p className="text-sm pt-2" style={{ color: "var(--text-dim)" }}>
              Only have junk silver?{" "}
              <Link href="/junk-silver-calculator" className="transition-colors hover:text-gray-300" style={{ color: "var(--text-muted)" }}>
                Try the junk silver calculator →
              </Link>
            </p>
            <p className="text-sm pt-1" style={{ color: "var(--text-dim)" }}>
              Live prices:{" "}
              <Link href="/silver-price" className="transition-colors hover:text-gray-300" style={{ color: "var(--text-muted)" }}>Silver</Link>
              {" · "}
              <Link href="/gold-price" className="transition-colors hover:text-gray-300" style={{ color: "var(--text-muted)" }}>Gold</Link>
            </p>
          </>
        ) : (
          <div className="text-left max-w-sm">
            <InlineSignup
              heading="Know what your stack is worth"
              subtext="Live spot prices, price alerts, and portfolio tracker. Free — 30 seconds."
              callbackUrl="/dashboard?onboarding=1"
            />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-6">
              <Link href="/gram" className="hover:text-gray-400 transition-colors">Price per gram →</Link>
              <Link href="/compare" className="hover:text-gray-400 transition-colors">Compare dealers</Link>
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
      </main>
  </>
  );
}
