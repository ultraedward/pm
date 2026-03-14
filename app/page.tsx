export const revalidate = 60;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkline } from "@/components/Sparkline";

// ─── types ────────────────────────────────────────────────────────────────────

type HistoryPoint = { price: number; timestamp: string };
type MetalData = {
  price: number;
  percentChange: number | null;
  history1D: HistoryPoint[];
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

    if (!rows.length) return { price: 0, percentChange: null, history1D: [], week52High: null, week52Low: null };

    const latest = rows[rows.length - 1];

    // 24H change
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let h1D = rows.filter((r) => r.timestamp >= oneDayAgo);
    if (h1D.length < 2) h1D = rows.slice(-12);
    const baseline = h1D[0];
    const percentChange =
      baseline?.price
        ? ((latest.price - baseline.price) / baseline.price) * 100
        : null;

    // 52W high / low
    const prices = rows.map((r) => r.price);
    const week52High = Math.max(...prices);
    const week52Low  = Math.min(...prices);

    return {
      price: latest.price,
      percentChange,
      history1D: h1D.map((r) => ({
        price: r.price,
        timestamp: r.timestamp.toISOString(),
      })),
      week52High,
      week52Low,
    };
  } catch {
    return { price: 0, percentChange: null, history1D: [], week52High: null, week52Low: null };
  }
}

// ─── design tokens ────────────────────────────────────────────────────────────

const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

const METAL_META: Record<Metal, { label: string; symbol: string; dot: string }> = {
  gold:      { label: "Gold",      symbol: "XAU", dot: "#f59e0b" },
  silver:    { label: "Silver",    symbol: "XAG", dot: "#94a3b8" },
  platinum:  { label: "Platinum",  symbol: "XPT", dot: "#a78bfa" },
  palladium: { label: "Palladium", symbol: "XPD", dot: "#34d399" },
};

// ─── components ───────────────────────────────────────────────────────────────

function PriceTile({ metal, data }: { metal: Metal; data: MetalData }) {
  const { label, symbol, dot } = METAL_META[metal];
  const isUp = (data.percentChange ?? 0) >= 0;
  const spark = data.history1D.map((p) => ({ value: p.price }));

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
    <div className="group px-7 py-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-gray-700">{symbol}</span>
      </div>

      <div>
        <div className="text-2xl font-black tracking-tightest tabular-nums">
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : <span className="text-white/15">—</span>
          }
        </div>
        {data.percentChange != null && (
          <div className={`mt-0.5 text-xs font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{data.percentChange.toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-700">24H</span>
          </div>
        )}
      </div>

      {spark.length > 1 && (
        <div className="opacity-30 group-hover:opacity-70 transition-opacity duration-300">
          <Sparkline data={spark} isPositive={isUp} />
        </div>
      )}

      {/* 52W range */}
      {rangePos !== null && data.week52Low && data.week52High && (
        <div className="space-y-1.5 pt-1">
          <div className="relative h-px w-full bg-white/10">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-400 -translate-x-1/2"
              style={{ left: `${Math.min(Math.max(rangePos, 4), 96)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] tabular-nums text-gray-700">
              ${data.week52Low.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            {fromHigh !== null && (
              <span className="text-[9px] tabular-nums text-gray-600">
                {fromHigh >= -0.1 ? "At 52W high" : `${fromHigh.toFixed(1)}% from high`}
              </span>
            )}
            <span className="text-[9px] tabular-nums text-gray-700">
              ${data.week52High.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
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
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── HERO + LIVE PRICES ───────────────────────────────────── */}
      <section className="relative px-6 pt-24 pb-20">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #d4a017 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">

          {/* Headline */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-14">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tightest leading-none">
              Gold. Silver.
              <br />
              <span className="text-amber-400">Platinum. Palladium.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Spot prices, price alerts, and portfolio tracking for all four metals in one place.
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
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "var(--border)" }}>
              {prices.map(([metal, data]) => (
                <PriceTile key={metal} metal={metal} data={data} />
              ))}
            </div>
            <div className="border-t px-7 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Spot prices</span>
              <span className="text-[10px] text-gray-700">Updated daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES — scannable, no paragraphs ──────────────────── */}
      <section className="border-t px-6 py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl">
          <span className="label block mb-10">The platform</span>

          <div className="grid gap-px bg-white/5 sm:grid-cols-3 rounded-2xl overflow-hidden">
            {[
              {
                num: "01",
                title: "Price Alerts",
                lines: ["Name your target price", "Email notification on trigger", "Above and below thresholds"],
              },
              {
                num: "02",
                title: "Portfolio Tracker",
                lines: ["Track ounces and cost basis", "P&L per holding, updated daily", "Allocation by metal"],
              },
              {
                num: "03",
                title: "Price Charts",
                lines: ["24H, 7D, 30D history", "All four metals", "Toggle series on and off"],
              },
            ].map(({ num, title, lines }) => (
              <div key={title} className="bg-black p-8 space-y-5">
                <span className="text-xs font-bold text-white/20 font-mono">{num}</span>
                <h3 className="text-base font-black tracking-tight">{title}</h3>
                <ul className="space-y-1.5">
                  {lines.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-amber-500/40">—</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="border-t px-6 py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-4xl">
          <span className="label block mb-10 text-center">How it works</span>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Sign up free",   body: "Connect your Google account. No payment information required." },
              { n: "02", title: "Set a target",   body: "Choose a metal, enter your target price, and select above or below." },
              { n: "03", title: "Get notified",   body: "You receive an email when the daily spot price crosses your threshold." },
            ].map(({ n, title, body }) => (
              <div key={n} className="space-y-3">
                <div className="text-4xl font-black tracking-tightest text-white/10">{n}</div>
                <h3 className="text-base font-black">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="border-t px-6 py-20 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-xl space-y-5">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tightest">
            Start free.
            <span className="text-amber-400"> Upgrade when it makes sense.</span>
          </h2>
          <p className="text-sm text-gray-500">No credit card required. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="btn-gold">
              Get started free
            </Link>
            <Link href="/pricing" className="btn-ghost">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span className="font-bold text-gray-400 tracking-widest uppercase">Precious Metals</span>
          <div className="flex gap-8">
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-gray-300 transition-colors">Sign in</Link>
          </div>
          <span>© {new Date().getFullYear()} Precious Metals</span>
        </div>
      </footer>

    </main>
  );
}
