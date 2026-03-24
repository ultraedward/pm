// /app/dashboard/page.tsx

import Link from "next/link";
import { DashboardCalculatorTabs } from "@/components/DashboardCalculatorTabs";
import { PredictionCard } from "@/components/PredictionCard";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

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

/** Returns the most recent DB price that is at least 20 hours old — used for 24H % change. */
async function getPrevDayPrice(metal: Metal) {
  const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000);
  return prisma.price.findFirst({
    where: { metal, timestamp: { lte: cutoff } },
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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, subscriptionStatus: true },
  });

  if (!user) redirect("/login");

  // Fetch live spot prices + prev-day DB rows (for 24H delta) + history in parallel
  const [
    holdings,
    liveSpots,
    goldPrev, silverPrev, platinumPrev, palladiumPrev,
    goldHistory, silverHistory, platinumHistory, palladiumHistory,
  ] = await Promise.all([
    prisma.holding.findMany({ where: { userId: user.id } }),
    fetchAllSpotPrices(),
    getPrevDayPrice("gold"),
    getPrevDayPrice("silver"),
    getPrevDayPrice("platinum"),
    getPrevDayPrice("palladium"),
    getRecentPrices("gold"),
    getRecentPrices("silver"),
    getRecentPrices("platinum"),
    getRecentPrices("palladium"),
  ]);

  const spots: Record<Metal, number> = {
    gold:      liveSpots.gold      ?? goldHistory[goldHistory.length - 1]?.price      ?? 0,
    silver:    liveSpots.silver    ?? silverHistory[silverHistory.length - 1]?.price    ?? 0,
    platinum:  liveSpots.platinum  ?? platinumHistory[platinumHistory.length - 1]?.price  ?? 0,
    palladium: liveSpots.palladium ?? palladiumHistory[palladiumHistory.length - 1]?.price ?? 0,
  };

  // 24H % change — live price vs yesterday's DB snapshot
  const prevSpots: Record<Metal, number> = {
    gold:      goldPrev?.price      ?? 0,
    silver:    silverPrev?.price    ?? 0,
    platinum:  platinumPrev?.price  ?? 0,
    palladium: palladiumPrev?.price ?? 0,
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

  const isPro = user.subscriptionStatus === "active";
  const gainLoss = totalValue - totalInvested;
  const pctReturn = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  const gainColor = gainLoss >= 0 ? "text-amber-400" : "text-red-400";

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
  const changeColor30d = change30d >= 0 ? "text-amber-400" : "text-red-400";

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <Link
            href="/dashboard/holdings"
            className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors min-h-[44px] flex items-center"
          >
            Manage Holdings
          </Link>
        </div>

        {/* Daily spot prices */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Spot Prices</p>
            <Link href="/gram" className="text-xs text-gray-600 hover:text-amber-400 transition-colors">
              Melt value calculator →
            </Link>
          </div>
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
                    <p className={`text-xs font-semibold tabular-nums ${isUp ? "text-amber-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}{chg.toFixed(2)}%
                      <span className="ml-1 font-normal text-gray-600">24H</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gold:Silver Ratio */}
        {spots.gold > 0 && spots.silver > 0 && (
          <div className="flex items-center justify-between px-5 py-3 rounded-xl border border-white/5 bg-gray-950">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Gold:Silver Ratio</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-black tabular-nums tracking-tightest">
                {(spots.gold / spots.silver).toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">oz of silver to buy 1 oz of gold</p>
            </div>
          </div>
        )}

        {/* Portfolio value — empty state for new users */}
        {holdings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-gray-950 p-10 text-center space-y-5">
            <div className="space-y-2">
              <p className="text-xl font-black tracking-tight text-white">Start tracking your stack</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                Add your gold, silver, platinum, or palladium and see your total portfolio value at current spot prices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/holdings"
                className="inline-block btn-gold px-7 py-2.5"
              >
                Add your first holding
              </Link>
              <Link
                href="/dashboard/alerts"
                className="inline-block rounded-full border border-white/10 px-7 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                Set a price alert
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-gray-950 px-6 py-7">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-widest mb-3">Total Portfolio Value</p>
            <p className="text-5xl font-black tracking-tightest tabular-nums leading-none">{fmtMoney(totalValue)}</p>
            <p className={`text-sm mt-3 font-medium tabular-nums ${gainColor}`}>
              {gainLoss >= 0 ? "+" : ""}{fmtMoney(gainLoss)} ({fmtPct(pctReturn)}) all-time
            </p>
          </div>
        )}

        {/* 30d portfolio chart — only shown when there are holdings */}
        {holdings.length > 0 && portfolioSpark && (
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">Portfolio value · 30 days</p>
              <p className={`text-sm font-semibold tabular-nums ${changeColor30d}`}>
                {change30d >= 0 ? "+" : ""}{fmtMoney(change30d)} ({fmtPct(pct30d)})
              </p>
            </div>
            <svg width="100%" height="80" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={change30d >= 0 ? "#F59E0B" : "#ef4444"} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={change30d >= 0 ? "#F59E0B" : "#ef4444"} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <polygon
                fill="url(#equityGrad)"
                points={`${portfolioSpark} 300,100 0,100`}
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke={change30d >= 0 ? "#F59E0B" : "#ef4444"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={portfolioSpark}
              />
            </svg>
          </div>
        )}

        {/* Daily Prediction */}
        <PredictionCard goldSpot={spots.gold} />

        {/* Unified calculator — coins/bars + jewelry/scrap */}
        <DashboardCalculatorTabs spots={spots} isPro={isPro} />

        {/* Nav links — Charts and Holdings only; Alerts is already in top Navbar */}
        <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { href: "/dashboard/charts",   label: "Price Charts",  sub: "30-day history"    },
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
