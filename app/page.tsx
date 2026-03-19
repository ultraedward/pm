export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkline } from "@/components/Sparkline";
import { QuickCalculator } from "@/components/QuickCalculator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
  description:
    "Track daily gold, silver, platinum, and palladium spot prices. Set custom price alerts and calculate coin melt values. Free precious metals portfolio tracker.",
  alternates: {
    canonical: "https://lode.rocks",
  },
  openGraph: {
    title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
    description:
      "Track daily gold, silver, platinum, and palladium spot prices. Set custom price alerts and calculate coin melt values. Free precious metals portfolio tracker.",
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

async function getMetalData(metal: Metal): Promise<MetalData> {
  try {
    const rows = await prisma.price.findMany({
      where: {
        metal,
        timestamp: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: "asc" },
    });

    if (!rows.length) return { price: 0, percentChange: null, history30D: [], week52High: null, week52Low: null, updatedAt: null };

    const latest = rows[rows.length - 1];

    // 24H % change — compare latest to the previous available data point
    const prev = rows.length >= 2 ? rows[rows.length - 2] : null;
    const percentChange =
      prev?.price
        ? ((latest.price - prev.price) / prev.price) * 100
        : null;

    // 30D sparkline — last 30 data points
    const history30D = rows.slice(-30).map((r) => ({
      price: r.price,
      timestamp: r.timestamp.toISOString(),
    }));

    // 52W high / low
    const prices = rows.map((r) => r.price);
    const week52High = Math.max(...prices);
    const week52Low  = Math.min(...prices);

    return {
      price: latest.price,
      percentChange,
      history30D,
      week52High,
      week52Low,
      updatedAt: latest.timestamp,
    };
  } catch {
    return { price: 0, percentChange: null, history30D: [], week52High: null, week52Low: null, updatedAt: null };
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
  if (!date) return "Updated daily";
  const diffMs  = Date.now() - date.getTime();
  const diffH   = diffMs / 1000 / 60 / 60;
  if (diffH < 1)  return "Updated just now";
  if (diffH < 24) return `Updated ${Math.floor(diffH)}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Updated yesterday";
  return `Updated ${diffD}d ago`;
}

export default async function HomePage() {
  const [session, [gold, silver, platinum, palladium]] = await Promise.all([
    getServerSession(authOptions),
    Promise.all(METALS.map((m) => getMetalData(m))),
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
        "description": "Live precious metals spot prices, portfolio tracker, and price alerts for gold, silver, platinum, and palladium.",
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
            "description": "3 price alerts, portfolio tracker, daily spot prices",
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
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-14">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tightest leading-none">
              Track every
              <br />
              <span style={{ color: "var(--gold-bright)" }}>ounce 🥇</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Daily spot prices, price alerts, and portfolio tracking for gold, silver, platinum, and palladium.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn-gold px-10">
                {isLoggedIn ? "Go to dashboard" : "Start tracking free"}
              </Link>
              {!isLoggedIn && (
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  See pricing →
                </Link>
              )}
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
            <h2 className="text-2xl font-black tracking-tight">How much is your stack worth?</h2>
            <p className="text-sm text-gray-500">Based on today&apos;s spot prices — no account needed.</p>
          </div>
          <QuickCalculator spots={{
            gold:      gold.price,
            silver:    silver.price,
            platinum:  platinum.price,
            palladium: palladium.price,
          }} />
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
          <p className="text-sm text-gray-500">Free to start. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-gold px-10">
              Get started free
            </Link>
            <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              See pricing →
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span className="font-bold text-gray-400 tracking-widest uppercase">Lode</span>
          <div className="flex gap-8">
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            {isLoggedIn
              ? <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              : <Link href="/login" className="hover:text-gray-300 transition-colors">Sign in</Link>
            }
          </div>
          <span>© {new Date().getFullYear()} Lode</span>
        </div>
      </footer>

    </main>
  );
}
