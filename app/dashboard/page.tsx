// /app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Metal = "gold" | "silver" | "platinum" | "palladium";

const METAL_DOTS: Record<Metal, string> = {
  gold:      "#D4AF37",
  silver:    "#C0C0C0",
  platinum:  "#E5E4E2",
  palladium: "#9FA8C7",
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

  // 24h % change — compare latest to previous data point
  const prevSpots: Record<Metal, number> = {
    gold:      goldHistory.length >= 2      ? goldHistory[goldHistory.length - 2].price      : 0,
    silver:    silverHistory.length >= 2    ? silverHistory[silverHistory.length - 2].price    : 0,
    platinum:  platinumHistory.length >= 2  ? platinumHistory[platinumHistory.length - 2].price  : 0,
    palladium: palladiumHistory.length >= 2 ? palladiumHistory[palladiumHistory.length - 2].price : 0,
  };
  const pctChange: Record<Metal, number | null> = {
    gold:      prevSpots.gold > 0      ? ((spots.gold - prevSpots.gold) / prevSpots.gold) * 100           : null,
    silver:    prevSpots.silver > 0    ? ((spots.silver - prevSpots.silver) / prevSpots.silver) * 100     : null,
    platinum:  prevSpots.platinum > 0  ? ((spots.platinum - prevSpots.platinum) / prevSpots.platinum) * 100   : null,
    palladium: prevSpots.palladium > 0 ? ((spots.palladium - prevSpots.palladium) / prevSpots.palladium) * 100 : null,
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
    <main className="min-h-screen bg-surface p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="label mb-1">Dashboard</p>
            <h1 className="text-3xl font-black tracking-tight">
              Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </h1>
          </div>
          <Link
            href="/dashboard/holdings"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            Manage Holdings
          </Link>
        </div>

        {/* Daily spot prices */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[rgba(212,175,55,0.12)]">
            {METALS.map((metal) => {
              const price = spots[metal];
              const chg = pctChange[metal];
              const isUp = (chg ?? 0) >= 0;
              return (
                <div key={metal} className="px-5 py-4 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: METAL_DOTS[metal] }} />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{metal}</p>
                  </div>
                  <p className="text-xl font-black tabular-nums tracking-tightest">
                    {price > 0 ? fmtMoney(price) : <span className="text-white/20">—</span>}
                  </p>
                  {chg !== null && (
                    <p className={`text-xs font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}{chg.toFixed(2)}%
                      <span className="ml-1 font-normal text-gray-600">24H</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio value — empty state for new users */}
        {holdings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-gray-950 p-10 text-center space-y-5">
            <p className="text-xl font-black tracking-tight text-white">No holdings yet</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              Add your gold, silver, platinum, or palladium positions to track portfolio value as prices update.
            </p>
            <Link
              href="/dashboard/holdings"
              className="inline-block btn-gold px-7 py-2.5"
            >
              Add a holding
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6">
            <p className="label mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-black tracking-tight tabular-nums">{fmtMoney(totalValue)}</p>
            <p className={`text-sm mt-2 font-medium tabular-nums ${gainColor}`}>
              {gainLoss >= 0 ? "+" : ""}{fmtMoney(gainLoss)} ({fmtPct(pctReturn)}) all-time
            </p>
          </div>
        )}

        {/* 30d equity chart — only shown when there are holdings */}
        {holdings.length > 0 && portfolioSpark && (
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <p className="label">30-Day Equity</p>
              <p className={`text-sm font-semibold tabular-nums ${changeColor30d}`}>
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
        <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-5">
          <p className="label">Quick Calculator</p>

          <form className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METALS.map((metal) => (
              <div key={metal}>
                <label className="text-xs text-gray-500 capitalize">{metal} oz</label>
                <input
                  name={`${metal}Oz`}
                  defaultValue={calcOz[metal] || ""}
                  className="mt-1 w-full rounded-lg bg-black border border-white/10 p-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                />
              </div>
            ))}
            <button
              type="submit"
              className="sm:col-span-4 col-span-2 rounded-full bg-white/5 border border-white/10 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Calculate
            </button>
          </form>

          {calcTotal > 0 && (
            <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
              {METALS.map((metal, i) =>
                calcValues[i] > 0 ? (
                  <p key={metal} className="flex justify-between">
                    <span className="capitalize text-gray-500">{metal}</span>
                    <span className="tabular-nums">{fmtMoney(calcValues[i])}</span>
                  </p>
                ) : null
              )}
              <p className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
                <span>Total</span>
                <span className="tabular-nums">{fmtMoney(calcTotal)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="grid grid-cols-2 gap-px sm:grid-cols-3 bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { href: "/dashboard/charts",   label: "Price Charts",  sub: "30-day history"    },
            { href: "/alerts",             label: "My Alerts",     sub: "Manage price alerts" },
            { href: "/dashboard/holdings", label: "Holdings",      sub: "Portfolio detail"   },
          ].map(({ href, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="group bg-black p-5 hover:bg-white/5 transition-colors"
            >
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
