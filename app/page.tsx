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
    "Live gold, silver, platinum, and palladium spot prices. Set daily email price alerts, calculate coin melt values, and track your precious metals portfolio.",
  alternates: {
    canonical: "https://lode.rocks",
  },
  openGraph: {
    title: "Gold & Silver Spot Prices Today — Precious Metals Tracker",
    description:
      "Live gold, silver, platinum, and palladium spot prices. Set daily email price alerts, calculate coin melt values, and track your precious metals portfolio.",
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
    <div className="group px-5 py-6 sm:px-7 sm:py-8 flex flex-col gap-5 transition-colors duration-200 hover:bg-white/[0.015]" style={{ borderLeft: "2px solid transparent" }}>
      {/* Metal identifier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
          <span className="label">{label}</span>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-gray-700">{symbol}</span>
      </div>

      {/* Price */}
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
            {isUp ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-700 tracking-normal">24H</span>
          </div>
        )}
      </div>

      {/* Sparkline */}
      {spark.length > 1 && (
        <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-400">
          <Sparkline data={spark} color={dot} />
        </div>
      )}

      {/* 52W range */}
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
            "description": "1 price alert, portfolio tracker, live spot prices",
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
      <section className="px-6 pt-16 pb-0 sm:pt-28">
        <div className="mx-auto max-w-6xl">

          {/* Eyebrow */}
          <p className="rainbow-accent label mb-5">Gold · Live spot price</p>

          {/* Giant price — viewport-scaled */}
          <div
            className="rainbow-text font-black tabular-nums leading-none"
            style={{
              fontSize: "clamp(4.5rem, 13vw, 10.5rem)",
              letterSpacing: "-0.05em",
            }}
          >
            ${Math.round(gold.price).toLocaleString("en-US")}
          </div>

          {/* Change + meta */}
          <div className="mt-4 flex items-center gap-6 flex-wrap">
            {gold.percentChange !== null && (
              <span className={`text-sm font-bold tabular-nums ${gold.percentChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {gold.percentChange >= 0 ? "▲" : "▼"} {Math.abs(gold.percentChange).toFixed(2)}% today
              </span>
            )}
            <span className="label">Live spot price</span>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn-gold">
              {isLoggedIn ? "Go to dashboard" : "Get started free"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICE PANEL ──────────────────────────────────────────── */}
      <section className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.06]">
            {prices.map(([metal, data]) => (
              <PriceTile key={metal} metal={metal} data={data} />
            ))}
          </div>
          <div className="border-t px-7 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="label">Spot prices · 30D trend</span>
            <span className="text-[10px] text-gray-700 tracking-wide uppercase">{fmtUpdated(lastUpdated)}</span>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────── */}
      <section id="calculator" className="border-t px-6 py-14 sm:py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="label">Melt calculator</p>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ letterSpacing: "-0.04em", lineHeight: "0.95" }}>
              What&apos;s it worth<br className="hidden sm:block" /> at today&apos;s spot?
            </h2>
            <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
              Coins, bars, jewelry, or scrap.
              {!isLoggedIn && (
                <>
                  {" "}
                  <Link href="/login" className="underline underline-offset-4 hover:text-white transition-colors">Sign up free</Link> to save your stack.
                </>
              )}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>
              Looking up a specific coin?{" "}
              <Link href="/coin-melt-calculator" className="underline underline-offset-4 hover:text-white transition-colors">
                See live melt values by coin type →
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
          {!isLoggedIn && (
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              <Link href="/login" className="hover:text-white transition-colors underline underline-offset-4">Track your portfolio →</Link>
            </p>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="border-t px-6 py-24" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-6xl space-y-8">
            <p className="label">Get started</p>
            <p
              className="font-black text-white"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.04em", lineHeight: "0.95" }}
            >
              Track your stack.<br />Free forever.
            </p>
            <Link href="/login" className="btn-gold">
              Create free account
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-black tracking-[0.3em] text-sm uppercase text-white hover:opacity-60 transition-opacity">Lode</Link>
          <div className="flex gap-8">
            <Link href="/pricing" className="hidden sm:block label hover:text-white transition-colors">Pricing</Link>
            <Link href="/privacy" className="label hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms"   className="label hover:text-white transition-colors">Terms</Link>
            {isLoggedIn
              ? <Link href="/dashboard" className="hidden sm:block label hover:text-white transition-colors">Dashboard</Link>
              : <Link href="/login"     className="hidden sm:block label hover:text-white transition-colors">Sign in</Link>
            }
          </div>
          <span className="hidden sm:block label">© {new Date().getFullYear()} Lode</span>
        </div>
      </footer>

    </main>
  );
}
