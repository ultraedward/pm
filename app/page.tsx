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
    <div className="card p-6 flex flex-col gap-5 group hover:border-white/15 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
          <span className="label">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-gray-600">{symbol}/USD</span>
      </div>

      {/* Price */}
      <div>
        <div className="text-3xl font-black tracking-tightest">
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : <span className="text-gray-700">—</span>
          }
        </div>
        {data.percentChange != null && (
          <div className={`mt-1 text-xs font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
            <span className="ml-1.5 font-normal text-gray-600">24H</span>
          </div>
        )}
      </div>

      {/* Sparkline */}
      {spark.length > 1 && (
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
          <Sparkline data={spark} isPositive={isUp} />
        </div>
      )}
    </div>
  );
}

const FEATURES = [
  {
    label: "Alerts",
    title: "Move when it matters.",
    body: "Set a target price and get an email the instant gold or silver crosses it. No app. No noise. Just signal.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    title: "Your stack. Quantified.",
    body: "Log your holdings with purchase price and date. Watch your real P&L move in real time as the market does.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: "Charts",
    title: "Spot the trend early.",
    body: "24H, 7D, and 30D price charts for all four metals. Toggle between them. Read the market, not the noise.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

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

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-32">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #d4a017 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5" style={{ borderColor: "rgba(212,160,23,0.3)", background: "rgba(212,160,23,0.07)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Live Market Data</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tightest leading-none">
            Know when
            <br />
            <span className="text-amber-400">gold moves.</span>
          </h1>

          {/* Sub */}
          <p className="mx-auto max-w-lg text-lg text-gray-400 font-light leading-relaxed">
            Spot prices for all four precious metals.
            Custom alerts. Portfolio tracking. All signal, no noise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/login" className="btn-gold">
              START FOR FREE
            </Link>
            <Link href="/pricing" className="btn-ghost">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE PRICES ──────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          {/* Section label */}
          <div className="mb-8 flex items-center justify-between">
            <span className="label">Live Spot Prices</span>
            <span className="text-xs text-gray-600">Updated daily</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prices.map(([metal, data]) => (
              <PriceTile key={metal} metal={metal} data={data} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="border-t px-6 py-28" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 max-w-xl">
            <span className="label">Built for Investors</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tightest">
              Everything you need.
              <br />
              <span className="text-gray-500">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid gap-px bg-white/5 sm:grid-cols-3 rounded-2xl overflow-hidden">
            {FEATURES.map(({ label, title, body, icon }) => (
              <div key={label} className="bg-black p-8 space-y-5 hover:bg-gray-950 transition-colors duration-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-amber-400">
                  {icon}
                </div>
                <div>
                  <span className="label">{label}</span>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="border-t px-6 py-28" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <span className="label">Process</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tightest">
              Up in 60 seconds.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Sign up free", body: "No credit card. No friction. Just your email." },
              { n: "02", title: "Set a target", body: "Pick a metal. Set your price. Choose above or below." },
              { n: "03", title: "Get the email", body: "When the market hits your number, we let you know instantly." },
            ].map(({ n, title, body }) => (
              <div key={n} className="space-y-4">
                <div className="text-5xl font-black tracking-tightest text-white/10">{n}</div>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section className="border-t px-6 py-28" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <span className="label">Pricing</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tightest">
              Start free.
              <br />
              <span className="text-gray-500">Scale when ready.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Free */}
            <div className="card p-8 space-y-8">
              <div>
                <span className="label">Free</span>
                <div className="mt-3 text-5xl font-black tracking-tightest">$0</div>
                <p className="mt-1 text-sm text-gray-500">Forever free. No card needed.</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                {["3 price alerts", "All 4 metals", "Portfolio tracker", "Email notifications"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="h-px w-4 bg-gray-700" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block rounded-xl border py-3 text-center text-sm font-semibold hover:bg-white/5 transition-colors" style={{ borderColor: "var(--border)" }}>
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl p-8 space-y-8 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1400 0%, #000 60%)", border: "1px solid rgba(212,160,23,0.35)" }}>
              <div
                className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, #d4a017 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="label text-amber-600">Pro</span>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 uppercase tracking-widest">Popular</span>
                </div>
                <div className="mt-3 text-5xl font-black tracking-tightest">$9</div>
                <p className="mt-1 text-sm text-gray-500">Per month. Cancel anytime.</p>
              </div>
              <ul className="relative space-y-3 text-sm text-gray-400">
                {["Unlimited alerts", "Percent-change alerts", "Priority email delivery", "Faster evaluation"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="h-px w-4 bg-amber-600/50" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="relative block rounded-xl bg-amber-500 py-3 text-center text-sm font-bold text-black hover:bg-amber-400 transition-colors">
                UPGRADE TO PRO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <section className="border-t px-6 py-28 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tightest">
            Ready to track
            <br />
            <span className="text-amber-400">the market?</span>
          </h2>
          <p className="text-gray-500">Free to start. No credit card required.</p>
          <Link href="/login" className="btn-gold inline-block">
            GET STARTED FREE
          </Link>
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
