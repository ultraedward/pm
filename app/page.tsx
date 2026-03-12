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
  lastUpdated: string;
};

// ─── data fetching ────────────────────────────────────────────────────────────

function filterSince(
  rows: { price: number; timestamp: Date }[],
  since: Date
) {
  return rows.filter((r) => r.timestamp >= since);
}

async function getMetalData(
  metal: "gold" | "silver"
): Promise<MetalData> {
  try {
    const rows = await prisma.price.findMany({
      where: {
        metal,
        timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: "asc" },
    });

    if (!rows.length) {
      return { price: 0, percentChange: null, history1D: [], lastUpdated: new Date().toISOString() };
    }

    const latest = rows[rows.length - 1];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let history1D = filterSince(rows, oneDayAgo);
    if (history1D.length < 2) history1D = rows.slice(-12);

    const baseline = history1D[0];
    const percentChange =
      baseline && baseline.price !== 0
        ? ((latest.price - baseline.price) / baseline.price) * 100
        : null;

    return {
      price: latest.price,
      percentChange,
      history1D: history1D.map((r) => ({
        price: r.price,
        timestamp: r.timestamp.toISOString(),
      })),
      lastUpdated: latest.timestamp.toISOString(),
    };
  } catch {
    return { price: 0, percentChange: null, history1D: [], lastUpdated: new Date().toISOString() };
  }
}

// ─── sub-components ───────────────────────────────────────────────────────────

function PriceCard({
  label,
  symbol,
  data,
  accentColor,
}: {
  label: string;
  symbol: string;
  data: MetalData;
  accentColor: string;
}) {
  const isPositive = (data.percentChange ?? 0) >= 0;
  const sparkData = data.history1D.map((p) => ({ value: p.price }));
  const hasPrice = data.price > 0;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span className="text-xs text-gray-600">{symbol}</span>
      </div>

      <div>
        {hasPrice ? (
          <div className="text-3xl font-bold tracking-tight">
            $
            {data.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ) : (
          <div className="text-3xl font-bold text-gray-700">—</div>
        )}

        {data.percentChange != null && (
          <div
            className={`mt-1 text-sm font-medium ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
            <span className="ml-1 text-gray-600 font-normal">24h</span>
          </div>
        )}
      </div>

      {sparkData.length > 1 && (
        <Sparkline data={sparkData} isPositive={isPositive} />
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 space-y-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-yellow-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/10 text-sm font-bold text-yellow-400">
      {n}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [gold, silver] = await Promise.all([
    getMetalData("gold"),
    getMetalData("silver"),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gray-900">
        {/* subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234,179,8,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-6xl px-6 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-medium text-yellow-400 mb-8">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Live prices updated daily
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Know the moment
            <br />
            <span className="text-yellow-400">gold moves.</span>
          </h1>

          <p className="mt-6 mx-auto max-w-xl text-lg text-gray-400 leading-relaxed">
            Track gold and silver spot prices, set custom alerts, and monitor
            your precious metals portfolio — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-yellow-500 px-8 py-3 text-sm font-semibold text-black hover:bg-yellow-400 transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-gray-700 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-gray-600 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Prices ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Spot Prices</h2>
            <p className="mt-1 text-sm text-gray-500">
              Updated daily from market data
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Track your portfolio →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <PriceCard
            label="Gold"
            symbol="XAU/USD"
            data={gold}
            accentColor="#f59e0b"
          />
          <PriceCard
            label="Silver"
            symbol="XAG/USD"
            data={silver}
            accentColor="#94a3b8"
          />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-3 text-gray-400 max-w-md mx-auto">
              Built for investors who want to stay ahead of the market without watching charts all day.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
              title="Price Alerts"
              description="Set a target price and get an email the moment gold or silver crosses it. No more refreshing charts."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              title="Portfolio Tracker"
              description="Log your gold and silver holdings with your purchase price. See your total value and gain/loss update in real time."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              title="Price History Charts"
              description="View 24h, 7-day, and 30-day price charts for gold and silver. Toggle between metals and spot trends at a glance."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Email Notifications"
              description="Instant email alerts when your price targets are hit. No app required — works wherever your inbox is."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Metal Calculator"
              description="Quickly calculate the spot value of any quantity of gold or silver using live prices — useful before you buy or sell."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Secure & Private"
              description="Your portfolio data stays yours. No ads, no selling your data — just a clean tool that does what it says."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-gray-900">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Up and running in minutes</h2>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Create a free account",
                description:
                  "Sign up with your email — no credit card required. Free accounts include up to 3 price alerts.",
              },
              {
                title: "Set your first alert",
                description:
                  "Choose a metal, pick a target price, and decide whether to trigger when it goes above or below. Done in 30 seconds.",
              },
              {
                title: "Get notified instantly",
                description:
                  "When the market hits your target, you'll get an email right away. No need to watch prices yourself.",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <StepBadge n={i + 1} />
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="mt-1 text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/login"
              className="inline-block rounded-full bg-yellow-500 px-10 py-3 text-sm font-semibold text-black hover:bg-yellow-400 transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section className="border-t border-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Simple pricing</h2>
            <p className="mt-3 text-gray-400">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="mt-1 text-sm text-gray-500">For casual investors</p>
              <div className="mt-5 text-4xl font-bold">
                $0
                <span className="text-base font-normal text-gray-500">/mo</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-400">
                {[
                  "Up to 3 price alerts",
                  "Gold & silver tracking",
                  "Portfolio value tracker",
                  "Email notifications",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block rounded-lg border border-gray-700 py-2.5 text-center text-sm font-medium text-gray-300 hover:bg-gray-900 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-yellow-500 bg-black p-8 shadow-[0_0_40px_-10px_rgba(234,179,8,0.15)]">
              <div className="absolute -top-3 right-6 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">For serious traders</p>
              <div className="mt-5 text-4xl font-bold">
                $9
                <span className="text-base font-normal text-gray-500">/mo</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-400">
                {[
                  "Unlimited price alerts",
                  "Percent-change alerts",
                  "Priority email delivery",
                  "Faster alert evaluation",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-8 block rounded-lg bg-yellow-500 py-2.5 text-center text-sm font-semibold text-black hover:bg-yellow-400 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-400">Precious Metals</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-gray-400 transition-colors">Sign in</Link>
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
          </div>
          <span>© {new Date().getFullYear()} Precious Metals</span>
        </div>
      </footer>

    </main>
  );
}
