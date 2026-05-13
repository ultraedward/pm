export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { prisma } from "@/lib/prisma";
import { MetalPriceChart } from "@/components/MetalPriceChart";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Gold Price Today — Live Spot Price Per Ounce",
  description:
    "Live gold spot price per troy ounce, updated in real time. See today's gold price, 30-day chart, price per gram, price per kilo, and key stats. Free — no sign-up required.",
  keywords: [
    "gold price today",
    "gold price per ounce",
    "gold spot price",
    "gold price per ounce today",
    "gold price now",
    "live gold price",
    "gold price chart",
    "gold price history",
    "gold spot price today",
    "current gold price",
    "gold price per gram",
    "gold price per kilo",
    "XAU price",
  ],
  alternates: {
    canonical: "https://lode.rocks/gold-price",
  },
  openGraph: {
    title: "Gold Price Today — Live Spot Price Per Ounce",
    description:
      "Live gold spot price per troy ounce with 30-day chart, per-gram and per-kilo rates, and key stats. Updated on every page load.",
    url: "https://lode.rocks/gold-price",
  },
};

const TROY_PER_GRAM = 1 / 31.1035;
const TROY_PER_KILO = 1000 / 31.1035;

function buildWeightRows(spot: number) {
  return [
    { label: "Per troy ounce",  value: spot },
    { label: "Per gram (fine)", value: spot * TROY_PER_GRAM },
    { label: "Per kilogram",    value: spot * TROY_PER_KILO },
    { label: "Per pennyweight", value: spot / 20 },
    { label: "Per grain",       value: spot / 480 }, // 1 troy oz = 480 grains
  ];
}

function fmt(n: number, digits = 2) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function fmtChange(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${fmt(n)}`;
}

function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

async function getGoldStats() {
  try {
    const rows = await prisma.price.findMany({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
      take: 30,
      select: { price: true, timestamp: true },
    });

    if (rows.length === 0) return null;

    const prices    = rows.map((r) => r.price);
    const high30    = Math.max(...prices);
    const low30     = Math.min(...prices);
    const oldest    = rows[rows.length - 1]?.price ?? null;
    const price7dAgo = rows[6]?.price ?? null;

    return { high30, low30, oldest, price7dAgo, count: rows.length };
  } catch {
    return null;
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",       "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Gold Price", "item": "https://lode.rocks/gold-price" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/gold-price#page",
      "url": "https://lode.rocks/gold-price",
      "name": "Gold Price Today — Live Spot Price Per Ounce",
      "description": "Live gold spot price per troy ounce with chart, per-gram rates, and 30-day stats.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the gold price today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The current gold spot price is shown at the top of this page and updates on every page load from Yahoo Finance futures data (GC=F). Gold prices change continuously during market hours (Sunday 6pm to Friday 5pm ET). On weekends and holidays the price shown reflects the last traded value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the gold spot price per gram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert gold spot price per troy ounce to price per gram, divide by 31.1035 (the number of grams in a troy ounce). For example, if gold is $3,000 per troy ounce, it is $3,000 ÷ 31.1035 = $96.45 per gram. The weight reference table on this page shows today's gold price per gram for every common unit.",
          },
        },
        {
          "@type": "Question",
          "name": "Why does the gold price change every day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gold trades continuously on global futures markets. The price moves with inflation expectations, real interest rates, the strength of the US dollar, central bank buying and selling activity, geopolitical uncertainty, and demand for gold ETFs and physical coins and bars.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between gold spot price and gold coin price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The spot price is the raw market price for pure gold at this moment. When you buy a gold coin from a dealer, you pay the spot price plus a premium — typically $50–$100 per ounce for common coins like American Gold Eagles or Canadian Maple Leafs. The premium covers minting, distribution, and dealer margin. Use lode.rocks/compare to see current premiums across major dealers.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the gold price per kilogram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert the gold price from troy ounces to kilograms, multiply by 32.1507 (the number of troy ounces in a kilogram). At $3,000 per troy ounce, one kilogram of gold is worth approximately $96,452. Kilo bars are a popular way for institutional and high-net-worth buyers to accumulate gold at lower premiums than coins.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the gold-to-silver ratio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The gold-to-silver ratio is how many troy ounces of silver it takes to buy one troy ounce of gold. Historically it has ranged from about 15:1 to over 120:1. When the ratio is high (above 80), silver is considered cheap relative to gold. Precious metals investors watch the ratio to time shifts between the two metals.",
          },
        },
        {
          "@type": "Question",
          "name": "Is now a good time to buy gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode provides price data, not investment advice. Whether gold is a good buy depends on your financial situation, goals, and time horizon. The tools on Lode — price history, alerts, and dealer comparison — can help you make a more informed decision, but should not be treated as a recommendation to buy or sell.",
          },
        },
      ],
    },
  ],
};

export default async function GoldPricePage() {
  const [spots, stats, session] = await Promise.all([
    fetchAllSpotPrices(),
    getGoldStats(),
    getServerSession(authOptions),
  ]);

  const isLoggedIn = !!session?.user?.email;
  const spot = spots.gold ?? 0;

  const change30 = stats?.oldest && spot ? spot - stats.oldest : null;
  const pct30    = stats?.oldest && change30 != null ? (change30 / stats.oldest) * 100 : null;
  const change7  = stats?.price7dAgo && spot ? spot - stats.price7dAgo : null;
  const pct7     = stats?.price7dAgo && change7 != null ? (change7 / stats.price7dAgo) * 100 : null;

  const weightRows = spot > 0 ? buildWeightRows(spot) : [];

  const updatedTime = new Date(spots.fetchedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const faqItems = (jsonLd["@graph"][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map(
    (qa) => ({ question: qa.name, answer: qa.acceptedAnswer.text })
  );

  return (
    <>
      <main className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-8 blur-3xl"
              style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl space-y-3">
            <p className="label">Live spot</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">
              Gold Price Today
            </h1>

            {/* Big price */}
            <div className="pt-2 pb-1">
              {spot > 0 ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter"
                    style={{ color: "var(--gold-bright)" }}
                  >
                    {fmt(spot)}
                  </span>
                  <span className="text-base text-gray-500 font-medium">per troy oz</span>
                </div>
              ) : (
                <span className="text-4xl font-black text-gray-600">—</span>
              )}
            </div>

            {/* Change pills + timestamp */}
            <div className="flex flex-wrap items-center gap-3">
              {change7 != null && pct7 != null && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tabular-nums"
                  style={{
                    background: change7 >= 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                    color:      change7 >= 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  7D {fmtChange(change7)} ({fmtPct(pct7)})
                </span>
              )}
              {change30 != null && pct30 != null && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tabular-nums"
                  style={{
                    background: change30 >= 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                    color:      change30 >= 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  30D {fmtChange(change30)} ({fmtPct(pct30)})
                </span>
              )}
              <span className="text-xs text-gray-700">Updated {updatedTime}</span>
            </div>
          </div>
        </section>

        {/* ── Chart ────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-8">
          <div className="mx-auto max-w-2xl">
            <MetalPriceChart metal="gold" />
          </div>
        </section>

        {/* ── Stats + weight table ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-10">
          <div className="mx-auto max-w-2xl space-y-6">

            {/* 30-day high / low */}
            {stats && (stats.high30 || stats.low30) && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "30-day high", value: fmt(stats.high30) },
                  { label: "30-day low",  value: fmt(stats.low30)  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border p-4 space-y-1"
                    style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">{label}</p>
                    <p className="text-lg font-black tabular-nums text-white">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Weight reference table */}
            {weightRows.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div
                  className="px-5 py-3 border-b flex items-center gap-2"
                  style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D4AF37" }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Gold price by weight — today
                  </p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {weightRows.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-400">{label}</span>
                      <span className="text-sm font-bold tabular-nums text-white">
                        {fmt(value, label.includes("gram") || label.includes("grain") ? 4 : 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Email capture ────────────────────────────────────────── */}
        {!isLoggedIn && (
          <section className="px-4 sm:px-6 pb-10">
            <div className="mx-auto max-w-2xl">
              <EmailCapture source="gold-price" />
            </div>
          </section>
        )}

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl space-y-10">
            <div>
              <p className="label mb-1">Context &amp; background</p>
              <h2 className="text-lg font-black tracking-tight">Understanding the gold market</h2>
            </div>
            <div className="space-y-10 text-sm text-gray-400 leading-relaxed">

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">What moves the gold price?</h3>
                <p>
                  Gold&rsquo;s spot price is set continuously by global futures markets, primarily{" "}
                  <strong className="text-white">COMEX</strong> in New York and the{" "}
                  <strong className="text-white">London Bullion Market Association (LBMA)</strong>, which
                  publishes a benchmark twice daily. Unlike silver, gold&rsquo;s demand is overwhelmingly
                  investment-driven — central banks, ETFs, coins, and bars account for most price movement.
                  Industrial demand (electronics, dentistry, aerospace) is a smaller share.
                </p>
                <p>
                  The two most powerful macro drivers are{" "}
                  <strong className="text-white">real interest rates</strong> and the{" "}
                  <strong className="text-white">US dollar&rsquo;s strength</strong>. When real rates fall
                  (inflation rises faster than Treasury yields), gold typically rises because holding
                  non-yielding gold becomes less costly relative to bonds. When the dollar weakens,
                  gold priced in dollars tends to rise as foreign buyers can afford more of it.
                  Geopolitical uncertainty and central bank reserve diversification are increasingly
                  important structural demand drivers as well.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">How to convert gold price to grams and kilos</h3>
                <p>
                  Gold spot price is always quoted in US dollars per troy ounce. One troy ounce equals
                  31.1035 grams — about 10% heavier than a standard avoirdupois ounce (28.35g). To get
                  the per-gram price, divide by 31.1035. To get the per-kilogram price, multiply by
                  32.1507 (the number of troy ounces in a kilogram).
                </p>
                <p>
                  The weight reference table above shows today&rsquo;s gold price per gram, per kilogram,
                  and per pennyweight (a unit used in jewelry). For custom weight and karat calculations,
                  use the{" "}
                  <Link href="/gram" className="text-amber-500 hover:text-amber-400 transition-colors">
                    gold price per gram calculator
                  </Link>
                  {" "}which covers 24k, 22k, 18k, 14k, 10k, and 9k gold at live spot.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Buying gold: spot price vs. what you actually pay</h3>
                <p>
                  The spot price shown on this page is not what you pay at a dealer — it&rsquo;s the raw
                  market rate for refined .999+ gold. Dealers charge a{" "}
                  <strong className="text-white">premium over spot</strong> that covers minting,
                  distribution, and their margin. For common government-minted coins like American Gold
                  Eagles or Canadian Gold Maple Leafs, premiums typically run $50–$100 per ounce above
                  spot. Gold bars carry lower premiums than coins. Larger purchases (kilo bars, for
                  example) often come with lower per-ounce premiums.
                </p>
                <p>
                  The{" "}
                  <Link href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">
                    dealer comparison page
                  </Link>{" "}
                  tracks current premiums across APMEX, JM Bullion, SD Bullion, and Money Metals so you
                  can see who&rsquo;s cheapest at today&rsquo;s spot before you buy.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Gold IRAs vs. physical gold</h3>
                <p>
                  Investors considering gold have two primary routes: physical ownership (coins and bars
                  held in a home safe or third-party vault) and a Gold IRA (a self-directed retirement
                  account that holds IRS-approved gold inside a tax-advantaged wrapper). Physical gold
                  gives you direct possession with no annual fees; a Gold IRA provides tax-deferred or
                  tax-free growth but requires a custodian and has storage fees. Many investors do both.
                  If you have a 401k or IRA to roll over, see the{" "}
                  <Link href="/gold-ira" className="text-amber-500 hover:text-amber-400 transition-colors">
                    Gold IRA guide
                  </Link>
                  .
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <p className="label mb-1">Questions</p>
              <h2 className="text-xl font-black tracking-tight">Common questions</h2>
            </div>
            <SimpleAccordion items={faqItems} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
          {isLoggedIn ? (
            <>
              <p className="text-sm text-gray-500">Tools for your stack</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <Link href="/silver-price" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Silver price today →
                </Link>
                <Link href="/coin-melt-calculator" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Coin melt calculator →
                </Link>
                <Link href="/gram" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Price per gram calculator →
                </Link>
                <Link href="/compare" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Compare dealers →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-black tracking-tight">Get alerts when gold moves</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Set a target price and get one email when gold crosses it. Free account, no spam.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="btn-gold px-10 inline-block">
                  Get started
                </Link>
                <Link href="/compare" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Compare dealer prices →
                </Link>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 pt-1">
                <Link href="/silver-price" className="hover:text-gray-400 transition-colors">Silver price today</Link>
                <span>·</span>
                <Link href="/coin-melt-calculator" className="hover:text-gray-400 transition-colors">Coin melt values</Link>
                <span>·</span>
                <Link href="/gram" className="hover:text-gray-400 transition-colors">Price per gram</Link>
                <span>·</span>
                <Link href="/gold-ira" className="hover:text-gray-400 transition-colors">Gold IRA guide</Link>
              </div>
            </>
          )}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
