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
};
type Metal = "gold" | "silver" | "platinum" | "palladium";

// ─── data ────────────────────────────────────────────────────────────────────

async function getMetalData(metal: Metal): Promise<MetalData> {
  try {
    const rows = await prisma.price.findMany({
      where: {
        metal,
        timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: "asc" },
    });

    if (!rows.length) return { price: 0, percentChange: null, history1D: [] };

    const latest = rows[rows.length - 1];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let h1D = rows.filter((r) => r.timestamp >= oneDayAgo);
    if (h1D.length < 2) h1D = rows.slice(-12);

    const baseline = h1D[0];
    const percentChange =
      baseline?.price
        ? ((latest.price - baseline.price) / baseline.price) * 100
        : null;

    return {
      price: latest.price,
      percentChange,
      history1D: h1D.map((r) => ({
        price: r.price,
        timestamp: r.timestamp.toISOString(),
      })),
    };
  } catch {
    return { price: 0, percentChange: null, history1D: [] };
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

  return (
    <div className="card p-5 flex flex-col gap-4 group hover:border-white/15 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
          <span className="label">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-gray-700">{symbol}</span>
      </div>

      <div>
        <div className="text-2xl font-black tracking-tightest">
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : <span className="text-gray-700">—</span>
          }
        </div>
        {data.percentChange != null && (
          <div className={`mt-0.5 text-xs font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-600">24H</span>
          </div>
        )}
      </div>

      {spark.length > 1 && (
        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkline data={spark} isPositive={isUp} />
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

          {/* Badge + headline */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "rgba(212,160,23,0.3)", background: "rgba(212,160,23,0.07)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Daily Spot Prices</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tightest leading-none">
              Four metals.
              <br />
              <span className="text-amber-400">One dashboard.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Spot prices updated daily for gold, silver, platinum, and palladium — with price alerts and portfolio tracking in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link href="/login" className="btn-gold">
                START FOR FREE
              </Link>
              <Link href="/pricing" className="btn-ghost">
                View pricing
              </Link>
            </div>
          </div>

          {/* Live price tiles — visible above the fold as social proof */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="label">Today&apos;s Spot Prices</span>
              <span className="text-xs text-gray-700">Updated daily</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {prices.map(([metal, data]) => (
                <PriceTile key={metal} metal={metal} data={data} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES — scannable, no paragraphs ──────────────────── */}
      <section className="border-t px-6 py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl">
          <span className="label block mb-10">What you get</span>

          <div className="grid gap-px bg-white/5 sm:grid-cols-3 rounded-2xl overflow-hidden">
            {[
              {
                icon: "🔔",
                title: "Price Alerts",
                lines: ["Set a target price", "Get an email when it hits", "Above or below triggers"],
              },
              {
                icon: "📊",
                title: "Portfolio Tracker",
                lines: ["Log ounces & purchase price", "Real-time P&L per holding", "Allocation breakdown"],
              },
              {
                icon: "📈",
                title: "Price Charts",
                lines: ["24H, 7D, 30D history", "All four metals", "Toggle metals on/off"],
              },
            ].map(({ icon, title, lines }) => (
              <div key={title} className="bg-black p-8 space-y-4">
                <div className="text-3xl">{icon}</div>
                <h3 className="text-base font-black tracking-tight">{title}</h3>
                <ul className="space-y-1.5">
                  {lines.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-amber-500/60">—</span>
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
              { n: "01", title: "Sign up free",   body: "No credit card. Just your Google account." },
              { n: "02", title: "Set a target",   body: "Pick a metal. Enter your price. Choose above or below." },
              { n: "03", title: "Get notified",   body: "We email you the moment the market hits your number." },
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
            Ready?
            <span className="text-amber-400"> It&apos;s free.</span>
          </h2>
          <p className="text-sm text-gray-500">No credit card. Cancel anytime. Up in 60 seconds.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="btn-gold">
              GET STARTED FREE
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
