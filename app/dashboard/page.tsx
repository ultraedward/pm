// /app/dashboard/page.tsx

import Link from "next/link";
import { DashboardCalculatorTabs } from "@/components/DashboardCalculatorTabs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";
import { SiteFooter } from "@/components/SiteFooter";
import { convertPricesFromUSD, type SupportedCurrency } from "@/lib/fx";
import { formatCurrency } from "@/lib/formatCurrency";

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
  const rows = await prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "desc" },
    take: 30,
  });
  return rows.reverse(); // return in ascending order for the sparkline
}

// fmtMoney is replaced by formatCurrency(n, currency) — see below

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
    select: { id: true, name: true, preferredCurrency: true },
  });
  const currency = (user?.preferredCurrency ?? "USD") as SupportedCurrency;

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

  const spotsUSD: Record<Metal, number> = {
    gold:      liveSpots.gold      ?? goldHistory[goldHistory.length - 1]?.price      ?? 0,
    silver:    liveSpots.silver    ?? silverHistory[silverHistory.length - 1]?.price    ?? 0,
    platinum:  liveSpots.platinum  ?? platinumHistory[platinumHistory.length - 1]?.price  ?? 0,
    palladium: liveSpots.palladium ?? palladiumHistory[palladiumHistory.length - 1]?.price ?? 0,
  };

  // Convert all spot prices to the user's preferred currency in one FX call
  const convertedSpots = await convertPricesFromUSD(
    { Gold: spotsUSD.gold, Silver: spotsUSD.silver, Platinum: spotsUSD.platinum, Palladium: spotsUSD.palladium },
    currency
  );
  const spots: Record<Metal, number> = {
    gold:      convertedSpots.Gold,
    silver:    convertedSpots.Silver,
    platinum:  convertedSpots.Platinum,
    palladium: convertedSpots.Palladium,
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
    <main
      className="px-4 py-6 sm:px-8 sm:py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 animate-fade-up">
          <div>
            <p className="label mb-1">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ letterSpacing: "-0.04em" }}>
              {user.name ? `Welcome back, ${user.name.split(" ")[0]}.` : "Welcome back."}
            </h1>
          </div>
          <Link
            href="/dashboard/holdings"
            className="shrink-0 border px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors min-h-[44px] flex items-center"
            style={{ borderColor: "var(--border-strong)" }}
          >
            Manage Holdings
          </Link>
        </div>

        {/* Daily spot prices */}
        <div
          className="border overflow-hidden rounded-none reveal"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="px-5 py-3 border-b flex items-center justify-between gap-4"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="label">Spot Prices</p>
            {spots.gold > 0 && spots.silver > 0 && (
              <p className="text-[11px] tabular-nums" style={{ color: "var(--text-dim)" }}>
                Gold/Silver ratio{" "}
                <span className="font-bold" style={{ color: "var(--text-muted)" }}>
                  {(spots.gold / spots.silver).toFixed(1)}
                </span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.06]">
            {METALS.map((metal, i) => {
              const price = spots[metal];
              const chg = pctChange[metal];
              const isUp = (chg ?? 0) >= 0;
              return (
                <div
                  key={metal}
                  className={`reveal reveal-delay-${i + 1} px-5 py-5 space-y-2`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: METAL_DOTS[metal] }}
                    />
                    <p className="label">{metal}</p>
                  </div>
                  <p
                    className="font-black tabular-nums leading-none"
                    style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)", letterSpacing: "-0.04em" }}
                  >
                    {price > 0
                      ? formatCurrency(price, currency)
                      : <span style={{ color: "var(--text-dim)" }}>—</span>
                    }
                  </p>
                  {chg !== null && (
                    <p className={`text-xs font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}{chg.toFixed(2)}%
                      <span className="ml-1 font-normal" style={{ color: "var(--text-dim)" }}>24H</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio value — empty state for new users */}
        {holdings.length === 0 ? (
          <div
            className="border border-dashed p-10 sm:p-14 text-center space-y-6 reveal"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <div className="space-y-2">
              <p className="text-xl font-black" style={{ letterSpacing: "-0.04em" }}>
                Start tracking your stack
              </p>
              <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Add your gold, silver, platinum, or palladium and see total portfolio value at live spot prices.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Link href="/dashboard/holdings" className="btn-gold">
                Add your first holding
              </Link>
              <Link
                href="/dashboard/alerts"
                className="text-xs font-medium transition-colors"
                style={{ color: "var(--text-dim)" }}
              >
                Or set a price alert →
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="border px-6 py-7 reveal"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="label mb-3">Total Portfolio Value</p>
            <p
              className="font-black tabular-nums leading-none"
              style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", letterSpacing: "-0.05em" }}
            >
              {formatCurrency(totalValue, currency)}
            </p>
            <p className={`text-sm mt-3 font-medium tabular-nums ${gainColor}`}>
              {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss, currency)}
              {" "}({fmtPct(pctReturn)}){" "}
              <span className="font-normal" style={{ color: "var(--text-dim)" }}>all-time</span>
            </p>
          </div>
        )}

        {/* 30d portfolio sparkline — only when there's enough history */}
        {holdings.length > 0 && portfolioSpark && portfolioHistory.length >= 7 && (
          <div
            className="border px-6 py-6 space-y-4 reveal"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-center">
              <p className="label">Portfolio · 30 days</p>
              <p className={`text-xs font-semibold tabular-nums ${changeColor30d}`}>
                {change30d >= 0 ? "+" : ""}{formatCurrency(change30d, currency)}{" "}
                <span className="font-normal" style={{ color: "var(--text-dim)" }}>({fmtPct(pct30d)})</span>
              </p>
            </div>
            <svg
              width="100%"
              height="72"
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={change30d >= 0 ? "#FFC200" : "#ef4444"} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={change30d >= 0 ? "#FFC200" : "#ef4444"} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon fill="url(#equityGrad)" points={`${portfolioSpark} 300,100 0,100`} />
              <polyline
                fill="none"
                stroke={change30d >= 0 ? "#FFC200" : "#ef4444"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={portfolioSpark}
              />
            </svg>
          </div>
        )}

        {/* Unified calculator */}
        <div className="reveal">
          <DashboardCalculatorTabs spots={spots} />
        </div>

        {/* Quick nav */}
        <div
          className="grid grid-cols-3 gap-px border overflow-hidden reveal"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border)" }}
        >
          {[
            { href: "/dashboard/charts",   label: "Price Charts", sub: "30-day history"  },
            { href: "/dashboard/holdings", label: "Holdings",     sub: "Portfolio detail" },
            { href: "/gram",               label: "Calculator",   sub: "Melt value"       },
          ].map(({ href, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="group p-5 hover:bg-white/[0.04] transition-colors duration-150"
              style={{ background: "var(--bg)" }}
            >
              <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors duration-150">
                {label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{sub}</p>
            </Link>
          ))}
        </div>

      </div>
      <SiteFooter />
    </main>
  );
}
