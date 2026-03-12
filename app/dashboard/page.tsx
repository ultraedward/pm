// /app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Metal = "gold" | "silver" | "platinum" | "palladium";

const METAL_COLORS: Record<Metal, string> = {
  gold:      "text-yellow-400",
  silver:    "text-gray-300",
  platinum:  "text-purple-400",
  palladium: "text-emerald-400",
};

const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

async function getLatestPrice(metal: Metal) {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

async function getRecentPrices(metal: Metal) {
  return prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "asc" },
    take: 30,
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function buildSparkline(values: number[], width = 300, height = 100) {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export default async function DashboardPage({ searchParams }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true },
  });

  if (!user) redirect("/login");

  // Fetch latest prices + history for all 4 metals in parallel
  const [
    holdings,
    goldRow, silverRow, platinumRow, palladiumRow,
    goldHistory, silverHistory, platinumHistory, palladiumHistory,
  ] = await Promise.all([
    prisma.holding.findMany({ where: { userId: user.id } }),
    getLatestPrice("gold"),
    getLatestPrice("silver"),
    getLatestPrice("platinum"),
    getLatestPrice("palladium"),
    getRecentPrices("gold"),
    getRecentPrices("silver"),
    getRecentPrices("platinum"),
    getRecentPrices("palladium"),
  ]);

  const spots: Record<Metal, number> = {
    gold:      goldRow?.price      ?? 0,
    silver:    silverRow?.price    ?? 0,
    platinum:  platinumRow?.price  ?? 0,
    palladium: palladiumRow?.price ?? 0,
  };

  // Portfolio totals
  let totalInvested = 0;
  let totalValue = 0;

  for (const h of holdings) {
    const ounces = Number(h.ounces);
    const purchasePrice = Number(h.purchasePrice);
    const spot = spots[h.metal as Metal] ?? purchasePrice;
    totalInvested += ounces * purchasePrice;
    totalValue += ounces * (spot || purchasePrice);
  }

  const gainLoss = totalValue - totalInvested;
  const pctReturn = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  const gainColor = gainLoss >= 0 ? "text-green-400" : "text-red-400";

  // 30-day portfolio equity sparkline (gold + silver only — most likely to have history)
  const goldOz    = holdings.filter((h) => h.metal === "gold").reduce((s, h) => s + Number(h.ounces), 0);
  const silverOz  = holdings.filter((h) => h.metal === "silver").reduce((s, h) => s + Number(h.ounces), 0);
  const platOz    = holdings.filter((h) => h.metal === "platinum").reduce((s, h) => s + Number(h.ounces), 0);
  const palladOz  = holdings.filter((h) => h.metal === "palladium").reduce((s, h) => s + Number(h.ounces), 0);

  const historyLength = Math.min(goldHistory.length, silverHistory.length);
  const portfolioHistory: number[] = [];

  for (let i = 0; i < historyLength; i++) {
    const gp = goldHistory[i]?.price ?? 0;
    const sp = silverHistory[i]?.price ?? 0;
    const pp = platinumHistory[i]?.price ?? 0;
    const pd = palladiumHistory[i]?.price ?? 0;
    portfolioHistory.push(goldOz * gp + silverOz * sp + platOz * pp + palladOz * pd);
  }

  const portfolioSpark = buildSparkline(portfolioHistory);
  const firstValue = portfolioHistory[0] ?? totalValue;
  const lastValue  = portfolioHistory[portfolioHistory.length - 1] ?? totalValue;
  const change30d  = lastValue - firstValue;
  const pct30d     = firstValue > 0 ? (change30d / firstValue) * 100 : 0;
  const changeColor30d = change30d >= 0 ? "text-green-400" : "text-red-400";

  // Calculator
  const calcOz: Record<Metal, number> = {
    gold:      Number(searchParams?.goldOz      ?? 0),
    silver:    Number(searchParams?.silverOz    ?? 0),
    platinum:  Number(searchParams?.platinumOz  ?? 0),
    palladium: Number(searchParams?.palladiumOz ?? 0),
  };
  const calcValues = METALS.map((m) => calcOz[m] * spots[m]);
  const calcTotal  = calcValues.reduce((s, v) => s + v, 0);

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name ?? "trader"}.</p>
          </div>
          <Link
            href="/dashboard/holdings"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
          >
            Manage Holdings
          </Link>
        </div>

        {/* Live spot prices */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {METALS.map((metal) => {
            const price = spots[metal];
            const colorClass = METAL_COLORS[metal];
            return (
              <div
                key={metal}
                className="rounded-xl border border-gray-800 bg-gray-950 p-4 space-y-1"
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${colorClass}`}>
                  {metal}
                </p>
                <p className="text-xl font-bold">
                  {price > 0 ? fmtMoney(price) : <span className="text-gray-600">—</span>}
                </p>
              </div>
            );
          })}
        </div>

        {/* Portfolio value */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <p className="text-sm text-gray-400">Total Portfolio Value</p>
          <p className="text-3xl font-bold mt-1">{fmtMoney(totalValue)}</p>
          <p className={`text-sm mt-1 ${gainColor}`}>
            {gainLoss >= 0 ? "+" : ""}{fmtMoney(gainLoss)} ({fmtPct(pctReturn)}) all-time
          </p>
        </div>

        {/* 30d equity chart */}
        {portfolioSpark && (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-400">Portfolio Equity (30 data points)</p>
              <p className={`text-sm font-semibold ${changeColor30d}`}>
                {change30d >= 0 ? "+" : ""}{fmtMoney(change30d)} ({fmtPct(pct30d)})
              </p>
            </div>
            <svg width="100%" height="80" viewBox="0 0 300 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={change30d >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                points={portfolioSpark}
              />
            </svg>
          </div>
        )}

        {/* Quick Metal Calculator */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4">
          <p className="text-sm font-medium text-gray-400">Quick Metal Calculator</p>

          <form className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METALS.map((metal) => (
              <div key={metal}>
                <label className="text-xs text-gray-500 capitalize">{metal} oz</label>
                <input
                  name={`${metal}Oz`}
                  defaultValue={calcOz[metal] || ""}
                  className="mt-1 w-full rounded bg-black border border-gray-700 p-2 text-white text-sm"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                />
              </div>
            ))}
            <button
              type="submit"
              className="sm:col-span-4 col-span-2 rounded bg-gray-800 py-2 text-sm hover:bg-gray-700 transition-colors"
            >
              Calculate
            </button>
          </form>

          {calcTotal > 0 && (
            <div className="border-t border-gray-800 pt-4 space-y-1 text-sm text-gray-300">
              {METALS.map((metal, i) =>
                calcValues[i] > 0 ? (
                  <p key={metal} className="flex justify-between">
                    <span className="capitalize text-gray-500">{metal}</span>
                    <span>{fmtMoney(calcValues[i])}</span>
                  </p>
                ) : null
              )}
              <p className="flex justify-between font-semibold text-white pt-1 border-t border-gray-800">
                <span>Total</span>
                <span>{fmtMoney(calcTotal)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { href: "/dashboard/charts",  label: "Price Charts"   },
            { href: "/alerts",            label: "My Alerts"      },
            { href: "/dashboard/holdings", label: "Holdings"      },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-center text-sm font-medium hover:bg-gray-900 hover:border-gray-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
