export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { InlineSignup } from "@/components/InlineSignup";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { getMetalRangeStats } from "@/lib/metalRangeStats";
import { MetalPriceChart } from "@/components/MetalPriceChart";
import { EmailCapture } from "@/components/EmailCapture";
import { SiteFooter } from "@/components/SiteFooter";
import { SimpleAccordion } from "@/components/SimpleAccordion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const spots = await fetchAllSpotPrices();
  const price = spots.platinum ?? 0;
  const priceStr = price > 0
    ? price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : null;
  const title = priceStr
    ? `Platinum Price Today: ${priceStr}/oz`
    : "Platinum Price Today — Live Spot Price Per Ounce";

  return {
    title,
    description:
      "Live platinum spot price per troy ounce, updated in real time. See today's platinum price, 30-day chart, price per gram, price per kilo, and key stats. Free — no sign-up required.",
    keywords: [
      "platinum price today",
      "platinum price per ounce",
      "platinum spot price",
      "platinum price per ounce today",
      "platinum price now",
      "live platinum price",
      "platinum price chart",
      "platinum price history",
      "platinum spot price today",
      "current platinum price",
      "platinum price per gram",
      "platinum price per kilo",
      "XPT price",
    ],
    alternates: {
      canonical: "https://lode.rocks/platinum-price",
    },
    openGraph: {
      title,
      description:
        "Live platinum spot price per troy ounce with 30-day chart, per-gram and per-kilo rates, and key stats. Updated on every page load.",
      url: "https://lode.rocks/platinum-price",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",            "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Platinum Price",  "item": "https://lode.rocks/platinum-price" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/platinum-price#page",
      "url": "https://lode.rocks/platinum-price",
      "name": "Platinum Price Today — Live Spot Price Per Ounce",
      "description": "Live platinum spot price per troy ounce with chart, per-gram rates, and 30-day stats.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the platinum price today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The current platinum spot price is shown at the top of this page and updates on every page load from Yahoo Finance futures data (PL=F). Platinum prices change continuously during market hours (Sunday 6pm to Friday 5pm ET). On weekends and holidays the price shown reflects the last traded value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the platinum spot price per gram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert platinum spot price per troy ounce to price per gram, divide by 31.1035 (the number of grams in a troy ounce). For example, if platinum is $1,000 per troy ounce, it is $1,000 ÷ 31.1035 = $32.15 per gram. The weight reference table on this page shows today's platinum price per gram and kilogram.",
          },
        },
        {
          "@type": "Question",
          "name": "Why is platinum sometimes cheaper than gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Platinum and gold prices are determined by different supply and demand dynamics. Platinum is rarer than gold in the Earth's crust — about 30 times rarer — but its price is driven more by industrial demand (especially automotive catalysts) than investment demand. When auto production slows or diesel vehicle adoption falls, platinum demand weakens and its price can drop below gold. Historically platinum traded at a premium to gold; the reversal since 2015 is primarily due to the decline of diesel vehicles in Europe, where catalytic converters for diesel engines use platinum.",
          },
        },
        {
          "@type": "Question",
          "name": "What drives the platinum price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Roughly 35–40% of annual platinum demand comes from catalytic converters — primarily in diesel vehicles, where platinum is the key active metal, and increasingly in hydrogen fuel cells. (Gasoline catalytic converters use palladium, not platinum.) South Africa produces roughly 70–75% of global platinum supply, so labor disputes, electricity shortages at mines, and the rand/dollar exchange rate can all move the platinum price significantly. Investment demand (ETFs, coins, bars) and jewelry — especially in Japan and China — make up most of the remainder.",
          },
        },
        {
          "@type": "Question",
          "name": "Is platinum a good investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode provides price data, not investment advice. Platinum is more volatile than gold and more sensitive to industrial cycles. Whether it fits your portfolio depends on your goals and risk tolerance. The tools on Lode — price history, alerts, and dealer comparison — can help you make a more informed decision, but should not be treated as a buy or sell recommendation.",
          },
        },
        {
          "@type": "Question",
          "name": "Where does platinum come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "South Africa accounts for roughly 70–75% of annual global platinum mine supply, with Russia (10%) and Zimbabwe (8%) as significant secondary producers. The Bushveld Igneous Complex in South Africa is the largest known deposit of platinum group metals in the world. Because supply is so geographically concentrated, production disruptions have an outsized impact on price.",
          },
        },
        {
          "@type": "Question",
          "name": "How does the platinum price compare to gold and palladium?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Historically, platinum traded at a premium to gold. Since around 2015, gold has been more expensive than platinum, driven by gold's investment demand surge and platinum's struggles with diesel-emission scandals and EV adoption. Palladium, used primarily in gasoline catalytic converters, surpassed platinum dramatically in 2018–2022 due to supply shortages, but has since corrected sharply. Lode tracks all four spot prices on the homepage so you can compare them at a glance.",
          },
        },
      ],
    },
  ],
};

export default async function PlatinumPricePage() {
  const [spots, stats, session] = await Promise.all([
    fetchAllSpotPrices(),
    getMetalRangeStats("platinum"),
    getServerSession(authOptions),
  ]);

  const isLoggedIn = !!session?.user?.email;
  const spot = spots.platinum ?? 0;

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

  // Platinum color
  const PLAT_COLOR = "#E5E4E2";
  const PLAT_GLOW  = "rgba(229,228,226,0.12)";

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
              style={{ background: `radial-gradient(circle, ${PLAT_COLOR} 0%, transparent 70%)` }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl space-y-3">
            <p className="label">Live spot</p>
            <h1 className="font-black leading-none" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}>
              Platinum Price Today
            </h1>

            {/* Big price */}
            <div className="pt-2 pb-1">
              {spot > 0 ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter"
                    style={{ color: PLAT_COLOR }}
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
            <MetalPriceChart metal="platinum" livePrice={spot > 0 ? spot : undefined} />
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
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: PLAT_COLOR }} />
                  <p className="label">Platinum price by weight — today</p>
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
              <EmailCapture source="platinum-price" />
            </div>
          </section>
        )}

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl space-y-10">
            <div>
              <p className="label mb-1">Context &amp; background</p>
              <h2 className="text-lg font-black tracking-tight">Understanding the platinum market</h2>
            </div>
            <div className="space-y-10 text-sm text-gray-400 leading-relaxed">

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">What moves the platinum price?</h3>
                <p>
                  Platinum is one of the rarest elements on Earth — global mine production is roughly
                  15–20 times smaller than gold by weight each year. Its price is driven by a split between{" "}
                  <strong className="text-white">industrial demand</strong> and{" "}
                  <strong className="text-white">investment demand</strong>, with industry (primarily
                  automotive catalysts) typically accounting for 35–45% of total consumption.
                </p>
                <p>
                  Because <strong className="text-white">South Africa</strong> produces roughly 70–75% of
                  global platinum supply, local factors — labor strikes at mines, electricity rationing
                  from Eskom (South Africa&rsquo;s state power utility), and the rand/dollar exchange rate —
                  can move the platinum price significantly even when global demand is stable. This supply concentration makes
                  platinum more volatile than gold on a per-event basis.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Platinum vs. gold: why the premium flipped</h3>
                <p>
                  For most of modern history, platinum traded at a premium to gold — sometimes 2× or
                  higher. That reversed around 2015 and gold has commanded a higher price ever since.
                  The primary culprit is the collapse of diesel vehicle adoption in Europe following
                  the Volkswagen emissions scandal in 2015. Diesel catalytic converters use platinum;
                  gasoline converters use palladium. As diesel lost market share, platinum demand from
                  auto manufacturers fell sharply. Gold, meanwhile, surged on investment demand
                  throughout the late 2010s and 2020s.
                </p>
                <p>
                  The potential wildcard for platinum&rsquo;s recovery is{" "}
                  <strong className="text-white">hydrogen fuel cells</strong>. Proton-exchange membrane
                  (PEM) fuel cells — the type used in hydrogen vehicles and stationary power — require
                  platinum as a catalyst. If green hydrogen adoption accelerates, platinum demand from
                  this sector could grow substantially over the coming decade.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Buying platinum: coins and bars</h3>
                <p>
                  Physical platinum is available in coins (American Platinum Eagle, Canadian Platinum
                  Maple Leaf, Australian Platinum Platypus) and bars from major refiners. Premiums
                  over spot for platinum tend to be higher than gold — often 5–10% for coins and
                  2–5% for larger bars — reflecting lower liquidity and smaller market size.
                </p>
                <p>
                  Use the{" "}
                  <Link href="/compare" className="link-gold">
                    dealer comparison page
                  </Link>{" "}
                  to see current premiums on gold and silver bullion. For platinum-specific pricing,
                  check major dealers like APMEX and JM Bullion directly and compare to the spot
                  price shown above.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Platinum in jewelry and industry</h3>
                <p>
                  Platinum&rsquo;s density, durability, and white luster make it prized in fine jewelry —
                  especially in Japan, where platinum engagement rings have historically dominated the
                  market. It is also used in laboratory equipment, electrical contacts, hard disk
                  coatings, and cancer-treatment drugs (cisplatin and carboplatin are platinum-based
                  chemotherapy agents). This broad industrial base means platinum price analysis
                  requires watching multiple end-markets simultaneously.
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
                <Link href="/palladium-price" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Palladium price today →
                </Link>
                <Link href="/compare" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Compare dealers →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-left max-w-sm">
              <InlineSignup
                heading="Get alerts when platinum moves"
                subtext="Set a target price and get one email when platinum crosses it. Free — 30 seconds."
                callbackUrl="/dashboard?onboarding=1"
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-6">
                <Link href="/compare" className="hover:text-gray-400 transition-colors">Compare dealers →</Link>
                <Link href="/gold-price" className="hover:text-gray-400 transition-colors">Gold price</Link>
              </div>
            </div>
          )}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
