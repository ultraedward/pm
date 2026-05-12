export const revalidate = 0;
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkline } from "@/components/Sparkline";
import { CalculatorTabs } from "@/components/CalculatorTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
  description:
    "Live gold, silver, platinum, and palladium spot prices. Set email price alerts, calculate coin melt values, and track your precious metals portfolio.",
  alternates: {
    canonical: "https://lode.rocks",
  },
  openGraph: {
    title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
    description:
      "Live gold, silver, platinum, and palladium spot prices. Set email price alerts, calculate coin melt values, and track your precious metals portfolio.",
    url: "https://lode.rocks",
  },
};

// ─── types ────────────────────────────────────────────────────────────────────

type HistoryPoint = { price: number; timestamp: string };
type MetalData = {
  price: number;
  percentChange: number | null;
  history30D: HistoryPoint[];
  week52High: number | null;
  week52Low: number | null;
  updatedAt: Date | null;
};
type Metal = "gold" | "silver" | "platinum" | "palladium";

// ─── data ────────────────────────────────────────────────────────────────────

async function getMetalData(metal: Metal, livePrice: number | null): Promise<MetalData> {
  try {
    const rows = await prisma.price.findMany({
      where: {
        metal,
        timestamp: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: "asc" },
    });

    const price = livePrice ?? (rows.length ? rows[rows.length - 1].price : 0);
    const updatedAt = livePrice ? new Date() : (rows.length ? rows[rows.length - 1].timestamp : null);

    if (!rows.length) return { price, percentChange: null, history30D: [], week52High: null, week52Low: null, updatedAt };

    const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const prevRow = [...rows].reverse().find((r) => r.timestamp <= cutoff);
    const percentChange = prevRow?.price ? ((price - prevRow.price) / prevRow.price) * 100 : null;

    const history30D = rows.slice(-30).map((r) => ({
      price: r.price,
      timestamp: r.timestamp.toISOString(),
    }));

    const prices = rows.map((r) => r.price);
    const week52High = Math.max(...prices);
    const week52Low  = Math.min(...prices);

    return { price, percentChange, history30D, week52High, week52Low, updatedAt };
  } catch {
    return { price: livePrice ?? 0, percentChange: null, history30D: [], week52High: null, week52Low: null, updatedAt: livePrice ? new Date() : null };
  }
}

// ─── design tokens ────────────────────────────────────────────────────────────

const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

const METAL_META: Record<Metal, { label: string; symbol: string; dot: string }> = {
  gold:      { label: "Gold",      symbol: "XAU", dot: "#D4AF37" },
  silver:    { label: "Silver",    symbol: "XAG", dot: "#C0C0C0" },
  platinum:  { label: "Platinum",  symbol: "XPT", dot: "#E5E4E2" },
  palladium: { label: "Palladium", symbol: "XPD", dot: "#9FA8C7" },
};

// ─── components ───────────────────────────────────────────────────────────────

function PriceTile({ metal, data }: { metal: Metal; data: MetalData }) {
  const { label, symbol, dot } = METAL_META[metal];
  const isUp = (data.percentChange ?? 0) >= 0;
  const spark = data.history30D.map((p) => ({ value: p.price }));

  const rangePos =
    data.week52High && data.week52Low && data.week52High !== data.week52Low && data.price > 0
      ? ((data.price - data.week52Low) / (data.week52High - data.week52Low)) * 100
      : null;

  return (
    <div className="group px-5 py-6 sm:px-7 sm:py-8 flex flex-col gap-5 transition-colors duration-200 hover:bg-white/[0.015]" style={{ borderLeft: "2px solid transparent" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
          <span className="label">{label}</span>
        </div>
        <span aria-hidden="true" className="text-[10px] font-mono tracking-widest text-gray-700">{symbol}</span>
      </div>

      <div>
        <div
          className="font-black tabular-nums leading-none"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)", letterSpacing: "-0.04em" }}
        >
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : <span className="text-white/15">—</span>
          }
        </div>
        {data.percentChange != null && (
          <div className={`mt-2 text-xs font-bold tabular-nums tracking-wide ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            <span aria-hidden="true">{isUp ? "▲" : "▼"}</span>
            <span className="sr-only">{isUp ? "Up" : "Down"}</span>
            {" "}{Math.abs(data.percentChange).toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-700 tracking-normal">24H</span>
          </div>
        )}
      </div>

      {spark.length > 1 && (
        <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-400">
          <Sparkline data={spark} color={dot} />
        </div>
      )}

      {rangePos !== null && data.week52Low && data.week52High && (
        <div className="space-y-1.5 pt-0.5 opacity-30 group-hover:opacity-80 transition-opacity duration-400">
          <div className="relative h-px w-full bg-white/[0.08]">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 -translate-x-1/2"
              style={{ left: `${Math.min(Math.max(rangePos, 3), 97)}%`, backgroundColor: "var(--gold)" }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] tabular-nums text-gray-700">
              ${data.week52Low.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="label">52W</span>
            <span className="text-[10px] tabular-nums text-gray-700">
              ${data.week52High.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

function fmtUpdated(date: Date | null): string {
  if (!date) return "Updating…";
  const diffMs  = Date.now() - date.getTime();
  const diffH   = diffMs / 1000 / 60 / 60;
  if (diffH < 1)  return "Updated just now";
  if (diffH < 24) return `Updated ${Math.floor(diffH)}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Updated yesterday";
  return `Updated ${diffD}d ago`;
}

export default async function HomePage() {
  const [session, liveSpots] = await Promise.all([
    getServerSession(authOptions),
    fetchAllSpotPrices(),
  ]);

  const [gold, silver, platinum, palladium] = await Promise.all([
    getMetalData("gold",      liveSpots.gold),
    getMetalData("silver",    liveSpots.silver),
    getMetalData("platinum",  liveSpots.platinum),
    getMetalData("palladium", liveSpots.palladium),
  ]);

  const isLoggedIn = !!session?.user?.email;
  const pricesUnavailable = liveSpots.source === "fallback";
  const prices: [Metal, MetalData][] = [
    ["gold", gold], ["silver", silver],
    ["platinum", platinum], ["palladium", palladium],
  ];

  const lastUpdated = [gold, silver, platinum, palladium]
    .map((d) => d.updatedAt)
    .filter(Boolean)
    .sort((a, b) => b!.getTime() - a!.getTime())[0] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://lode.rocks/#app",
        "name": "Lode — Precious Metals Tracker",
        "url": "https://lode.rocks",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "isPartOf": { "@id": "https://lode.rocks/#site" },
        "offers": [
          {
            "@type": "Offer",
            "name": "Free",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Unlimited price alerts, portfolio tracker, live spot prices, weekly digest",
          },
        ],
      },
    ],
  };

  const features = [
    {
      label: "Price alerts",
      body: "Set a target. One email when your metal crosses it. No noise, no daily digests.",
      href: isLoggedIn ? "/dashboard/alerts" : "/login",
    },
    {
      label: "Coin melt value",
      body: "Eagles, Maple Leafs, Morgans, junk silver — melt value at today's live spot.",
      href: "/coin-melt-calculator",
    },
    {
      label: "Dealer comparison",
      body: "See who's cheapest before you buy. Premiums tracked across major dealers.",
      href: "/compare",
    },
    {
      label: "Portfolio tracker",
      body: "Log your holdings. See total stack value against live spot in real time.",
      href: isLoggedIn ? "/dashboard/holdings" : "/login",
    },
    {
      label: "Price history",
      body: "30-day charts for all four metals. See the trend before you buy or sell.",
      href: isLoggedIn ? "/dashboard/charts" : "/login",
    },
    {
      label: "Gold IRA guide",
      body: "Augusta, Goldco, Birch Gold — fees, minimums, and who each is best for.",
      href: "/gold-ira",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── PRICES UNAVAILABLE BANNER ────────────────────────────── */}
      {pricesUnavailable && (
        <div className="w-full px-6 py-3 text-center text-xs font-semibold tracking-wide" style={{ background: "#1a1200", color: "#D4AF37", borderBottom: "1px solid #3a2d00" }}>
          Live price feeds are temporarily unavailable — showing recent cached values.
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-14 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-6xl">

          <p className="label mb-6 animate-fade-up">Precious metals tracker</p>

          <h1
            className="font-black text-white animate-fade-up animate-delay-100"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.75rem)", letterSpacing: "-0.04em", lineHeight: "0.93" }}
          >
            Know what your<br />stack is worth.
          </h1>

          <p
            className="mt-7 text-base leading-relaxed max-w-lg animate-fade-up animate-delay-200"
            style={{ color: "var(--text-muted)" }}
          >
            Email alerts when prices hit your target. Coin melt calculator. Dealer comparison.
            Portfolio tracker. Free forever.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up animate-delay-300">
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn-gold">
              {isLoggedIn ? "Go to dashboard" : "Get started — it's free"}
            </Link>
            <Link
              href="#calculator"
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Try the calculator ↓
            </Link>
          </div>

          {/* Compact metal price strip — credibility, not the product */}
          <div
            className="mt-14 pt-7 border-t animate-fade-up animate-delay-400"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-x-8 gap-y-4">
              {prices.map(([metal, data]) => {
                const { label, dot } = METAL_META[metal];
                const isUp = (data.percentChange ?? 0) >= 0;
                return (
                  <div key={metal} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="label">{label}</span>
                    {data.price > 0 && (
                      <span className="font-bold tabular-nums text-white text-sm">
                        ${data.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    )}
                    {data.percentChange != null && (
                      <span className={`text-[11px] font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                        {isUp ? "▲" : "▼"}{Math.abs(data.percentChange).toFixed(2)}%
                      </span>
                    )}
                  </div>
                );
              })}
              <span className="hidden sm:block label ml-auto">{fmtUpdated(lastUpdated)}</span>
            </div>
            <p className="mt-3 sm:hidden label">{fmtUpdated(lastUpdated)}</p>
          </div>

        </div>
      </section>

      {/* ── PRICE PANEL ─────────────────────────────────────────── */}
      <section className="border-t reveal" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="px-7 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <p className="label">Today&apos;s spot prices</p>
            <div className="flex items-center gap-4">
              <Link href="/gold-price"   className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors">Gold detail →</Link>
              <Link href="/silver-price" className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors">Silver detail →</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.06]">
            {prices.map(([metal, data]) => {
              const detailHref = metal === "gold" ? "/gold-price" : metal === "silver" ? "/silver-price" : null;
              const tile = <PriceTile key={metal} metal={metal} data={data} />;
              return detailHref ? (
                <Link key={metal} href={detailHref} className="block hover:bg-white/[0.01] transition-colors" aria-label={`${METAL_META[metal].label} price detail`}>
                  {tile}
                </Link>
              ) : tile;
            })}
          </div>
          <div className="border-t px-7 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="label">Spot prices · 30-day trend</span>
            <span className="text-[10px] text-gray-700 tracking-wide uppercase">{fmtUpdated(lastUpdated)}</span>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────── */}
      <section id="calculator" className="border-t px-6 py-14 sm:py-20 reveal" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="label">Melt calculator</p>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ letterSpacing: "-0.04em", lineHeight: "0.95" }}>
              What&apos;s it worth at today&apos;s spot?
            </h2>
            <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
              Coins, bars, jewelry, or scrap. —{" "}
              <Link href="/coin-melt-calculator" className="underline underline-offset-4 hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
                browse by coin type →
              </Link>
            </p>
          </div>
          <CalculatorTabs
            spots={{
              gold:      gold.price,
              silver:    silver.price,
              platinum:  platinum.price,
              palladium: palladium.price,
            }}
          />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="border-t px-6 py-14 sm:py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="reveal space-y-2">
            <p className="label">What Lode does</p>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ letterSpacing: "-0.04em", lineHeight: "0.95" }}>
              Every tool a stacker needs.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/5" style={{ background: "rgba(255,255,255,0.04)" }}>
            {features.map(({ label, body, href }, i) => (
              <Link
                key={label}
                href={href}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} group p-7 hover:bg-white/[0.04] transition-colors duration-200 space-y-3`}
                style={{ background: "var(--bg)" }}
              >
                <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors duration-150">
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {body}
                </p>
                <p className="text-[11px] text-amber-700 group-hover:text-amber-400 transition-colors duration-150">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT CTA ────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="border-t px-6 py-24 sm:py-32 reveal" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-6xl space-y-7">
            <p className="label">Price alerts</p>
            <p
              className="font-black text-white"
              style={{ fontSize: "clamp(2rem, 6vw, 4.25rem)", letterSpacing: "-0.04em", lineHeight: "0.93" }}
            >
              Tell me when<br />gold hits $____
            </p>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              One email. Your target price crossed. No noise, no daily digests.
              Free — takes 30 seconds.
            </p>
            <Link href="/login" className="btn-gold">
              Set your first alert
            </Link>
          </div>
        </section>
      )}

      <SiteFooter />

    </main>
  );
}
