export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { InlineSignup } from "@/components/InlineSignup";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { prisma } from "@/lib/prisma";
import { MetalPriceChart } from "@/components/MetalPriceChart";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const spots = await fetchAllSpotPrices();
  const price = spots.palladium ?? 0;
  const priceStr = price > 0
    ? price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : null;
  const title = priceStr
    ? `Palladium Price Today: ${priceStr}/oz`
    : "Palladium Price Today — Live Spot Price Per Ounce";

  return {
    title,
    description:
      "Live palladium spot price per troy ounce, updated in real time. See today's palladium price, 30-day chart, price per gram, price per kilo, and key stats. Free — no sign-up required.",
    keywords: [
      "palladium price today",
      "palladium price per ounce",
      "palladium spot price",
      "palladium price per ounce today",
      "palladium price now",
      "live palladium price",
      "palladium price chart",
      "palladium price history",
      "palladium spot price today",
      "current palladium price",
      "palladium price per gram",
      "palladium price per kilo",
      "XPD price",
    ],
    alternates: {
      canonical: "https://lode.rocks/palladium-price",
    },
    openGraph: {
      title,
      description:
        "Live palladium spot price per troy ounce with 30-day chart, per-gram and per-kilo rates, and key stats. Updated on every page load.",
      url: "https://lode.rocks/palladium-price",
    },
  };
}

const TROY_PER_GRAM = 1 / 31.1035;
const TROY_PER_KILO = 1000 / 31.1035;

function buildWeightRows(spot: number) {
  return [
    { label: "Per troy ounce",  value: spot },
    { label: "Per gram (fine)", value: spot * TROY_PER_GRAM },
    { label: "Per kilogram",    value: spot * TROY_PER_KILO },
    { label: "Per pennyweight", value: spot / 20 },
    { label: "Per grain",       value: spot / 480 },
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

async function getPalladiumStats() {
  try {
    const rows = await prisma.price.findMany({
      where: { metal: "palladium" },
      orderBy: { timestamp: "desc" },
      take: 30,
      select: { price: true, timestamp: true },
    });

    if (rows.length === 0) return null;

    const prices     = rows.map((r) => r.price);
    const high30     = Math.max(...prices);
    const low30      = Math.min(...prices);
    const oldest     = rows[rows.length - 1]?.price ?? null;
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
        { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Palladium Price",  "item": "https://lode.rocks/palladium-price" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/palladium-price#page",
      "url": "https://lode.rocks/palladium-price",
      "name": "Palladium Price Today — Live Spot Price Per Ounce",
      "description": "Live palladium spot price per troy ounce with chart, per-gram rates, and 30-day stats.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the palladium price today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The current palladium spot price is shown at the top of this page and updates on every page load from Yahoo Finance futures data (PA=F). Palladium prices change continuously during market hours (Sunday 6pm to Friday 5pm ET). On weekends and holidays the price shown reflects the last traded value.",
          },
        },
        {
          "@type": "Question",
          "name": "Why did palladium prices spike so dramatically?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Palladium prices surged from around $500/oz in 2016 to nearly $3,000/oz in early 2022 due to a sustained supply deficit. Palladium is primarily used in gasoline catalytic converters, and tightening global auto emissions standards drove record demand at a time when mine supply — concentrated in Russia and South Africa — was constrained. After peaking in 2022, prices fell sharply as EV adoption reduced gasoline vehicle sales and automakers worked down inventories.",
          },
        },
        {
          "@type": "Question",
          "name": "What drives the palladium price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Palladium demand is overwhelmingly driven by catalytic converters for gasoline-powered vehicles — it is the key platinum-group metal used in modern three-way catalysts for petrol engines. Stricter emissions standards globally increase per-vehicle palladium loading. On the supply side, Russia (via Nornickel) produces about 40% of the world's palladium, and South Africa produces most of the rest. Geopolitical risk around Russian supply has periodically caused sharp price moves. Electric vehicle adoption is the main long-term demand headwind, as EVs require no catalytic converters.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the palladium spot price per gram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert palladium spot price per troy ounce to price per gram, divide by 31.1035 (the number of grams in a troy ounce). The weight reference table on this page shows today's palladium price per gram, per kilogram, and per pennyweight, calculated live from the current spot price.",
          },
        },
        {
          "@type": "Question",
          "name": "How does palladium compare to platinum?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Palladium and platinum are closely related platinum-group metals (PGMs) with overlapping but distinct uses. Palladium dominates in gasoline catalytic converters; platinum is used in diesel catalysts and hydrogen fuel cells. Palladium dramatically outperformed platinum from 2016–2022 due to the diesel-to-gasoline shift in global auto markets. Since 2022, palladium has corrected while platinum has held more stable. Both metals are tracked live on the Lode homepage.",
          },
        },
        {
          "@type": "Question",
          "name": "Can you buy physical palladium?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, physical palladium is available in bars and a limited number of coins (the Canadian Palladium Maple Leaf is the most widely recognized government-minted palladium coin). The palladium bullion market is much smaller and less liquid than gold or silver, which means premiums over spot are higher and buy-sell spreads are wider. Most palladium investment exposure is taken through ETFs or futures rather than physical metal.",
          },
        },
        {
          "@type": "Question",
          "name": "Is palladium a good investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode provides price data, not investment advice. Palladium is the most volatile of the four major precious metals and is closely tied to the automotive cycle and EV adoption trends. Whether it fits your portfolio depends on your goals and risk tolerance. The tools on Lode — price history and alerts — can help you monitor palladium price levels, but should not be treated as a buy or sell recommendation.",
          },
        },
      ],
    },
  ],
};

export default async function PalladiumPricePage() {
  const [spots, stats, session] = await Promise.all([
    fetchAllSpotPrices(),
    getPalladiumStats(),
    getServerSession(authOptions),
  ]);

  const isLoggedIn = !!session?.user?.email;
  const spot = spots.palladium ?? 0;

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

  // Palladium color
  const PALL_COLOR = "#9FA8C7";
  const PALL_GLOW  = "rgba(159,168,199,0.12)";

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
              style={{ background: `radial-gradient(circle, ${PALL_COLOR} 0%, transparent 70%)` }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl space-y-3">
            <p className="label">Live spot</p>
            <h1 className="font-black leading-none" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}>
              Palladium Price Today
            </h1>

            {/* Big price */}
            <div className="pt-2 pb-1">
              {spot > 0 ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter"
                    style={{ color: PALL_COLOR }}
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
                    color:      change7 >= 0 ? "var(--color-up)" : "var(--color-down)",
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
                    color:      change30 >= 0 ? "var(--color-up)" : "var(--color-down)",
                  }}
                >
                  30D {fmtChange(change30)} ({fmtPct(pct30)})
                </span>
              )}
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>Updated {updatedTime}</span>
            </div>
          </div>
        </section>

        {/* ── Chart ────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-8">
          <div className="mx-auto max-w-2xl">
            <MetalPriceChart metal="palladium" />
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
                    className="border p-4 space-y-1"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <p className="label">{label}</p>
                    <p className="text-lg font-black tabular-nums" style={{ color: "var(--text)" }}>{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Weight reference table */}
            {weightRows.length > 0 && (
              <div className="border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div
                  className="px-5 py-3 border-b flex items-center gap-2"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: PALL_COLOR }} />
                  <p className="label">Palladium price by weight — today</p>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {weightRows.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--text)" }}>
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
              <EmailCapture source="palladium-price" />
            </div>
          </section>
        )}

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl space-y-10">
            <div>
              <p className="label mb-1">Context &amp; background</p>
              <h2 className="text-lg font-black tracking-tight">Understanding the palladium market</h2>
            </div>
            <div className="space-y-10 text-sm text-gray-400 leading-relaxed">

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">What is palladium used for?</h3>
                <p>
                  Unlike gold or silver, palladium has minimal monetary history. Its value is almost
                  entirely industrial. Roughly{" "}
                  <strong className="text-white">85% of annual palladium demand</strong> comes from
                  catalytic converters in gasoline-powered vehicles. The three-way catalytic converter
                  in modern petrol cars uses palladium (sometimes alongside platinum and rhodium) to
                  convert carbon monoxide, hydrocarbons, and nitrogen oxides into less harmful
                  emissions.
                </p>
                <p>
                  Tighter emissions regulations — Euro 6 in Europe, China 6 in China, Tier 3 in the
                  US — increased the amount of palladium required per vehicle throughout the 2010s,
                  driving sustained demand growth even as production volumes were relatively flat.
                  This mismatch between supply and demand produced the dramatic price spike from
                  ~$500/oz in 2016 to nearly $3,000/oz in 2022.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">The EV headwind</h3>
                <p>
                  Electric vehicles require no catalytic converters and therefore no palladium. As EV
                  market share grows globally, long-term palladium demand from automotive
                  manufacturers is expected to decline. The rate of this decline depends on how
                  quickly EV adoption displaces internal-combustion engine (ICE) vehicles, which
                  varies significantly by region. China and Europe are transitioning faster than
                  the US.
                </p>
                <p>
                  The palladium price correction from its 2022 peak reflects the market pricing in
                  this structural headwind alongside an easing of the supply deficit that drove
                  prices higher.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Supply: Russia and South Africa</h3>
                <p>
                  <strong className="text-white">Russia</strong>, primarily through Nornickel (Norilsk
                  Nickel), produces approximately 40% of global palladium supply. South Africa
                  produces most of the remainder. This extreme supply concentration means geopolitical
                  events — sanctions, export restrictions, mine disruptions — can cause sharp,
                  rapid price moves independent of demand fundamentals.
                </p>
                <p>
                  Palladium is primarily mined as a byproduct of nickel and platinum mining, which
                  means producers cannot easily ramp up palladium output independently. This supply
                  inelasticity amplified the price spike when demand surged, and limits how quickly
                  new supply can respond to price signals.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Palladium vs. platinum substitution</h3>
                <p>
                  Automakers have long been aware of the cost risk from palladium concentration and
                  have invested in research to substitute platinum for palladium in gasoline
                  catalysts. This substitution is technically feasible but requires significant
                  retooling of catalyst chemistry. If palladium prices remain elevated relative to
                  platinum for an extended period, thrifting (using less palladium per vehicle) and
                  platinum substitution could reduce palladium demand — a self-correcting mechanism
                  that the market watches closely.
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
                <Link href="/gold-price" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Gold price today →
                </Link>
                <Link href="/silver-price" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Silver price today →
                </Link>
                <Link href="/platinum-price" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Platinum price today →
                </Link>
                <Link href="/compare" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Compare dealers →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-left max-w-sm">
              <InlineSignup
                heading="Get alerts when palladium moves"
                subtext="Set a target price and get one email when palladium crosses it. Free — 30 seconds."
                callbackUrl="/dashboard?onboarding=1"
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-6">
                <Link href="/compare" className="hover:text-gray-400 transition-colors">Compare dealers →</Link>
                <Link href="/platinum-price" className="hover:text-gray-400 transition-colors">Platinum price</Link>
              </div>
            </div>
          )}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
