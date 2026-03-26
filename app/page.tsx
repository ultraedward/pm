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

export const metadata: Metadata = {
  title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
  description:
    "Track gold, silver, platinum, and palladium spot prices — updated every 15 minutes. Set custom price alerts and calculate coin melt values. Precious metals portfolio tracker.",
  alternates: {
    canonical: "https://lode.rocks",
  },
  openGraph: {
    title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
    description:
      "Track gold, silver, platinum, and palladium spot prices — updated every 15 minutes. Set custom price alerts and calculate coin melt values. Precious metals portfolio tracker.",
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

    // 24H % change — live price vs the most recent DB snapshot ≥20h old
    const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const prevRow = [...rows].reverse().find((r) => r.timestamp <= cutoff);
    const percentChange = prevRow?.price ? ((price - prevRow.price) / prevRow.price) * 100 : null;

    // 30D sparkline — last 30 DB data points
    const history30D = rows.slice(-30).map((r) => ({
      price: r.price,
      timestamp: r.timestamp.toISOString(),
    }));

    // 52W high / low (from DB history)
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

  // 52W range bar position (0–100%)
  const rangePos =
    data.week52High && data.week52Low && data.week52High !== data.week52Low && data.price > 0
      ? ((data.price - data.week52Low) / (data.week52High - data.week52Low)) * 100
      : null;

  return (
    <div className="group px-4 py-5 sm:px-7 sm:py-7 flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <span className="text-xs font-mono text-gray-600">{symbol}</span>
      </div>

      <div>
        <div className="text-3xl font-black tracking-tightest tabular-nums">
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : <span className="text-white/15">—</span>
          }
        </div>
        {data.percentChange != null && (
          <div className={`mt-1 text-sm font-semibold tabular-nums ${isUp ? "text-amber-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{data.percentChange.toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-600">24H</span>
          </div>
        )}
      </div>

      {spark.length > 1 && (
        <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkline data={spark} color={dot} />
        </div>
      )}

      {/* 52W range — subtle by default, clearer on hover */}
      {rangePos !== null && data.week52Low && data.week52High && (
        <div className="space-y-1.5 pt-1 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          {/* Range bar */}
          <div className="relative h-px w-full bg-white/10">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full -translate-x-1/2"
              style={{ left: `${Math.min(Math.max(rangePos, 4), 96)}%`, backgroundColor: "var(--gold-bright)" }}
            />
          </div>
          {/* Low / High labels */}
          <div className="flex items-center justify-between">
            <span className="text-xs tabular-nums text-gray-600">
              ${data.week52Low.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-gray-700">52W</span>
            <span className="text-xs tabular-nums text-gray-600">
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
        "@type": "WebSite",
        "@id": "https://lode.rocks/#website",
        "url": "https://lode.rocks",
        "name": "Lode",
        "description": "Precious metals spot prices updated every 15 minutes — portfolio tracker and price alerts for gold, silver, platinum, and palladium.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://lode.rocks/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": "https://lode.rocks/#app",
        "name": "Lode — Precious Metals Tracker",
        "url": "https://lode.rocks",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free",
            "price": "0",
            "priceCurrency": "USD",
            "description": "3 price alerts, portfolio tracker, spot prices updated every 15 minutes",
          },
          {
            "@type": "Offer",
            "name": "Pro",
            "price": "3.00",
            "priceCurrency": "USD",
            "description": "Unlimited price alerts, everything in Free",
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

      {/* ── HERO + LIVE PRICES ───────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-12 sm:pt-24 sm:pb-20">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">

          {/* Headline */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-14">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Gold · XAU</p>
              <p className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none" style={{ color: "var(--gold-bright)" }}>
                ${Math.round(gold.price).toLocaleString("en-US")}
              </p>
              {gold.percentChange !== null && (
                <p className={`text-sm font-bold tracking-wide ${gold.percentChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {gold.percentChange >= 0 ? "+" : ""}{gold.percentChange.toFixed(2)}% today
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              Price alerts and portfolio tracking for gold, silver, platinum, and palladium.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn-gold px-10">
                {isLoggedIn ? "Go to dashboard" : "Get started"}
              </Link>
            </div>
          </div>

          {/* Price panel */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[rgba(212,175,55,0.12)]">
              {prices.map(([metal, data]) => (
                <PriceTile key={metal} metal={metal} data={data} />
              ))}
            </div>
            <div className="border-t px-7 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Spot prices · 30D trend</span>
              <span className="text-xs text-gray-600">{fmtUpdated(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-10 sm:py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-black tracking-tight">What&apos;s it worth at today&apos;s spot price?</h2>
            <p className="text-sm text-gray-500">Coins, bars, jewelry, or scrap — no account needed.</p>
          </div>
          <CalculatorTabs
            spots={{
              gold:      gold.price,
              silver:    silver.price,
              platinum:  platinum.price,
              palladium: palladium.price,
            }}
          />
          {!isLoggedIn && (
            <p className="text-center text-xs text-gray-600">
              <Link href="/login" className="hover:text-gray-400 transition-colors underline underline-offset-2">Sign in to track your full portfolio →</Link>
            </p>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="border-t px-6 py-20 text-center space-y-6" style={{ borderColor: "var(--border)" }}>
          <p className="text-3xl font-black tracking-tight">Ready to track your stack?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-gold px-10">
              Get started
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <Link href="/" className="font-bold text-gray-400 tracking-widest uppercase hover:text-white transition-colors">Lode</Link>
          <div className="flex gap-6">
            <Link href="/pricing" className="hidden sm:block hover:text-gray-300 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-gray-300 transition-colors">Terms</Link>
            {isLoggedIn
              ? <Link href="/dashboard" className="hidden sm:block hover:text-gray-300 transition-colors">Dashboard</Link>
              : <Link href="/login"     className="hidden sm:block hover:text-gray-300 transition-colors">Sign in</Link>
            }
          </div>
          <span className="hidden sm:block">© {new Date().getFullYear()} Lode</span>
        </div>
      </footer>

    </main>
  );
}
