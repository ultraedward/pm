export const revalidate = 60;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkline } from "@/components/Sparkline";

// ─── types ────────────────────────────────────────────────────────────────────

type HistoryPoint = { price: number; timestamp: string };
type MetalData = {
  price: number;
  percentChange: number | null;
  history30D: HistoryPoint[];
  week52High: number | null;
  week52Low: number | null;
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

    if (!rows.length) return { price: 0, percentChange: null, history30D: [], week52High: null, week52Low: null };

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
    };
  } catch {
    return { price: 0, percentChange: null, history30D: [], week52High: null, week52Low: null };
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

  // % from 52W high
  const fromHigh =
    data.week52High && data.price > 0
      ? ((data.price - data.week52High) / data.week52High) * 100
      : null;

  return (
    <div className="group px-7 py-7 flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.02]">
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
          <div className={`mt-1 text-sm font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{data.percentChange.toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-600">24H</span>
          </div>
        )}
      </div>

      {spark.length > 1 && (
        <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkline data={spark} isPositive={isUp} />
        </div>
      )}

      {/* 52W range */}
      {rangePos !== null && data.week52Low && data.week52High && (
        <div className="space-y-1.5 pt-1">
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
          {/* % from high — own line, no wrapping */}
          {fromHigh !== null && (
            <p className="text-xs tabular-nums text-center text-gray-500">
              {fromHigh >= -0.1 ? "At 52W high" : `${fromHigh.toFixed(1)}% from 52W high`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [gold, silver, platinum, palladium] = await Promise.all(
    METALS.map((m) => getMetalData(m))
  );
  const prices: [Metal, MetalData][] = [
    ["gold", gold], ["silver", silver],
    ["platinum", platinum], ["palladium", palladium],
  ];

  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">

      {/* ── HERO + LIVE PRICES ───────────────────────────────────── */}
      <section className="relative px-6 pt-24 pb-20">

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
              <span style={{ color: "var(--gold-bright)" }}>ounce.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Live spot prices, price alerts, and portfolio tracking for gold, silver, platinum, and palladium.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link href="/login" className="btn-gold">
                Start tracking
              </Link>
              <Link href="/pricing" className="btn-ghost">
                View pricing
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
              <span className="text-xs text-gray-600">Updated daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP ────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(212,175,55,0.12)]">

          <div className="px-8 py-14 space-y-4 group">
            <p className="text-5xl font-black tracking-tightest" style={{ color: "var(--gold-bright)" }}>01</p>
            <p className="text-lg font-black tracking-tight text-white">Price alerts</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Set a target. Get an email the moment gold, silver, platinum, or palladium crosses it.
            </p>
          </div>

          <div className="px-8 py-14 space-y-4 group">
            <p className="text-5xl font-black tracking-tightest" style={{ color: "var(--gold-bright)" }}>02</p>
            <p className="text-lg font-black tracking-tight text-white">Portfolio tracker</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Log your ounces and cost basis. Watch P&amp;L update in real time as spot prices move.
            </p>
          </div>

          <div className="px-8 py-14 space-y-4 group">
            <p className="text-5xl font-black tracking-tightest" style={{ color: "var(--gold-bright)" }}>03</p>
            <p className="text-lg font-black tracking-tight text-white">Price charts</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              30-day trends and 52-week range for all four metals, updated daily.
            </p>
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login" className="btn-gold">
            Get started free
          </Link>
          <Link href="/pricing" className="btn-ghost">
            See pricing
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span className="font-bold text-gray-400 tracking-widest uppercase">Lode</span>
          <div className="flex gap-8">
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-gray-300 transition-colors">Sign in</Link>
          </div>
          <span>© {new Date().getFullYear()} Lode</span>
        </div>
      </footer>

    </main>
  );
}
