export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { prisma } from "@/lib/prisma";
import { SilverPriceChart } from "@/components/SilverPriceChart";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Silver Price Today — Live Spot Price Per Ounce",
  description:
    "Live silver spot price per troy ounce, updated in real time. See today's silver price, 30-day chart, price per gram, and key stats. Free — no sign-up required.",
  keywords: [
    "silver price today",
    "silver price per ounce",
    "silver spot price",
    "silver price per ounce today",
    "silver price now",
    "live silver price",
    "silver price chart",
    "silver price history",
    "silver spot price today",
    "current silver price",
    "silver price per gram",
    "silver price per kilo",
  ],
  alternates: {
    canonical: "https://lode.rocks/silver-price",
  },
  openGraph: {
    title: "Silver Price Today — Live Spot Price Per Ounce",
    description:
      "Live silver spot price per troy ounce with 30-day chart, per-gram and per-kilo rates, and key stats. Updated on every page load.",
    url: "https://lode.rocks/silver-price",
  },
};

const TROY_PER_GRAM = 1 / 31.1035;
const TROY_PER_KILO = 1000 / 31.1035;

// Weight reference rows
function buildWeightRows(spot: number) {
  return [
    { label: "Per troy ounce",   value: spot },
    { label: "Per gram (fine)", value: spot * TROY_PER_GRAM },
    { label: "Per kilogram",     value: spot * TROY_PER_KILO },
    { label: "Per pennyweight",  value: spot / 20 },
    { label: "Per pound",        value: spot * (12 / 1) }, // troy pounds
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

async function getSilverStats() {
  try {
    // Last 30 daily snapshots, newest first
    const rows = await prisma.price.findMany({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
      take: 30,
      select: { price: true, timestamp: true },
    });

    if (rows.length === 0) return null;

    const prices = rows.map((r) => r.price);
    const high30  = Math.max(...prices);
    const low30   = Math.min(...prices);
    const oldest  = rows[rows.length - 1]?.price ?? null;

    // 7-day: index 6 (7 snapshots ago)
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
        { "@type": "ListItem", "position": 1, "name": "Home",         "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Silver Price", "item": "https://lode.rocks/silver-price" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/silver-price#page",
      "url": "https://lode.rocks/silver-price",
      "name": "Silver Price Today — Live Spot Price Per Ounce",
      "description": "Live silver spot price per troy ounce with chart, per-gram rates, and 30-day stats.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the silver price today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The current silver spot price is shown at the top of this page and updates on every page load from Yahoo Finance futures data (SI=F). Silver prices change continuously during market hours (Sunday 6pm to Friday 5pm ET). On weekends and holidays the price shown reflects the last traded value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the silver spot price per gram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert silver spot price per troy ounce to price per gram, divide by 31.1035 (the number of grams in a troy ounce). For example, if silver is $30.00 per troy ounce, it is $30.00 ÷ 31.1035 = $0.9646 per gram. Use the weight reference table on this page or the silver price per gram calculator at lode.rocks/gram for an interactive calculation.",
          },
        },
        {
          "@type": "Question",
          "name": "Why does the silver price change every day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Silver is traded around the clock on global futures markets. The price fluctuates based on industrial demand (silver is used in solar panels, electronics, and medical equipment), investment demand (ETFs, coins, bars), the US dollar's strength, and broader macroeconomic conditions including interest rates and inflation expectations.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between silver spot price and silver coin price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The spot price is the raw market price for pure silver. When you buy a silver coin from a dealer, you pay the spot price plus a premium — typically $3–8 per ounce for common coins like American Silver Eagles, less for generic rounds. The premium covers minting, distribution, and dealer margin. Use lode.rocks/compare to see current premiums across major dealers.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the silver price per kilogram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert the silver price from troy ounces to kilograms, multiply by 32.1507 (the number of troy ounces in a kilogram). If silver is $30.00 per troy ounce, one kilogram of silver is worth approximately $964.52. Kilo bars are a popular way for larger buyers to accumulate silver at lower premiums than coins.",
          },
        },
        {
          "@type": "Question",
          "name": "Is now a good time to buy silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode provides price data, not investment advice. Whether silver is a good buy depends on your financial situation, goals, and time horizon. The tools on Lode — price history, alerts, and dealer comparison — can help you make a more informed decision, but should not be treated as a recommendation to buy or sell.",
          },
        },
      ],
    },
  ],
};

export default async function SilverPricePage() {
  const [spots, stats, session] = await Promise.all([
    fetchAllSpotPrices(),
    getSilverStats(),
    getServerSession(authOptions),
  ]);

  const isLoggedIn = !!session?.user?.email;
  const spot = spots.silver ?? 0;

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

  return (
    <>
    <main className="bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-8 blur-3xl"
            style={{ background: "radial-gradient(circle, #C0C0C0 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl space-y-3">
          <p className="label">Live spot</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">
            Silver Price Today
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
                  color: change7 >= 0 ? "#4ade80" : "#f87171",
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
                  color: change30 >= 0 ? "#4ade80" : "#f87171",
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
          <SilverPriceChart />
        </div>
      </section>

      {/* ── Stats + weight table ─────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* 30-day high / low — server-rendered */}
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

          {/* Weight reference — server-rendered */}
          {weightRows.length > 0 && (
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div
                className="px-5 py-3 border-b flex items-center gap-2"
                style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Silver price by weight — today
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {weightRows.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-bold tabular-nums text-white">
                      {fmt(value, label.includes("gram") ? 4 : 2)}
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
            <EmailCapture source="silver-price" />
          </div>
        </section>
      )}

      {/* ── Editorial ────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-10">
          <div>
            <p className="label mb-1">Context &amp; background</p>
            <h2 className="text-lg font-black tracking-tight">Understanding the silver market</h2>
          </div>
          <div className="space-y-10 text-sm text-gray-400 leading-relaxed">

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">What moves the silver price?</h3>
              <p>
                Silver trades on two distinct demand bases simultaneously, which makes it more volatile than
                gold. <strong className="text-white">Industrial demand</strong> accounts for roughly half of all
                silver consumption — it is used in solar panels, EV batteries, electronics, medical equipment, and
                water purification. As the renewable energy build-out accelerates, industrial silver demand has
                grown significantly. <strong className="text-white">Investment demand</strong> — physical coins
                and bars, ETFs, and futures — drives most of the price volatility. When investors rotate into
                precious metals during periods of dollar weakness or inflation concern, silver often moves more
                sharply than gold.
              </p>
              <p>
                The <strong className="text-white">gold-to-silver ratio</strong> is a key metric many silver
                investors watch. When the ratio is historically high (above 80:1), silver is considered cheap
                relative to gold. When it compresses toward 50:1 or below, silver has typically outperformed
                gold during that period.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">How to convert silver price to grams and kilos</h3>
              <p>
                Silver spot price is always quoted in US dollars per troy ounce. One troy ounce equals
                31.1035 grams, so to get the per-gram price, divide the spot price by 31.1035. To get the
                per-kilogram price, multiply by 32.1507 (the number of troy ounces in a kilogram).
              </p>
              <p>
                The weight reference table above shows today&rsquo;s silver price per gram, per kilogram, and per
                pennyweight (a unit used for jewelry). For jewelry, coin, and scrap calculations, the{" "}
                <Link href="/gram" className="text-amber-500 hover:text-amber-400 transition-colors">
                  silver price per gram calculator
                </Link>{" "}
                lets you enter any weight and purity (fine .999, sterling 925, coin 900) to get an instant
                melt value.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Buying silver: spot price vs. what you actually pay</h3>
              <p>
                The spot price shown on this page is not what you pay at a dealer — it&rsquo;s the raw market price
                for pure silver. Dealers charge a <strong className="text-white">premium over spot</strong> that
                covers minting costs, distribution, and their margin. For common government-minted coins like
                American Silver Eagles, premiums typically run $3–8 per ounce above spot. Generic silver rounds
                carry lower premiums. Buying in larger quantities (a full monster box of 500 Eagles, for example)
                usually reduces the per-ounce premium.
              </p>
              <p>
                The{" "}
                <Link href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">
                  dealer comparison page
                </Link>{" "}
                tracks current premiums across APMEX, JM Bullion, SD Bullion, and Money Metals so you can see
                who&rsquo;s cheapest at today&rsquo;s spot.
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
          <SimpleAccordion
            items={(jsonLd["@graph"][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map(
              (qa) => ({ question: qa.name, answer: qa.acceptedAnswer.text })
            )}
          />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        {isLoggedIn ? (
          <>
            <p className="text-sm text-gray-500">Tools for your stack</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <Link href="/junk-silver-calculator" className="text-gray-400 hover:text-gray-200 transition-colors">
                Junk silver calculator →
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
            <p className="text-2xl font-black tracking-tight">Get alerts when silver moves</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Set a target price and get one email when silver crosses it. Free account, no spam.
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
              <Link href="/junk-silver-calculator" className="hover:text-gray-400 transition-colors">Junk silver calculator</Link>
              <span>·</span>
              <Link href="/gram" className="hover:text-gray-400 transition-colors">Price per gram</Link>
              <span>·</span>
              <Link href="/coin-melt-calculator" className="hover:text-gray-400 transition-colors">Coin melt values</Link>
            </div>
          </>
        )}
      </section>

      <SiteFooter />
      </main>
  </>
  );
}
