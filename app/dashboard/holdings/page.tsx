import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SiteFooter } from "@/components/SiteFooter";
import { formatCurrency } from "@/lib/formatCurrency";
import { convertPricesFromUSD, type SupportedCurrency } from "@/lib/fx";
import { hasProAccess } from "@/lib/entitlements";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

export const dynamic = "force-dynamic";

async function getLatestPrice(metal: string) {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

/* ============================= */
/*        SERVER ACTIONS         */
/* ============================= */

async function addHolding(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  const metal = formData.get("metal") as string;
  const ounces = Number(formData.get("ounces"));
  const purchasePrice = Number(formData.get("purchasePrice"));
  const purchaseDate = new Date(formData.get("purchaseDate") as string);

  const VALID_METALS = ["gold", "silver", "platinum", "palladium"];
  if (!VALID_METALS.includes(metal)) return;
  if (!ounces || isNaN(ounces) || ounces <= 0) return;
  if (!purchasePrice || isNaN(purchasePrice) || purchasePrice <= 0) return;
  if (isNaN(purchaseDate.getTime())) return;

  await prisma.holding.create({
    data: {
      userId: user.id,
      metal,
      ounces,
      purchasePrice,
      purchaseDate,
    },
  });

  revalidatePath("/dashboard/holdings");
}

async function deleteHolding(id: string) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  await prisma.holding.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/holdings");
}

/* ============================= */
/*            PAGE               */
/* ============================= */

export default async function HoldingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, preferredCurrency: true, subscriptionStatus: true, proUntil: true },
  });

  const isPro = user ? hasProAccess({ stripeStatus: user.subscriptionStatus, proUntil: user.proUntil }) : false;

  if (!user) {
    return (
      <div className="p-10 text-white">
        User not found
      </div>
    );
  }

  const currency = (user.preferredCurrency ?? "USD") as SupportedCurrency;

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const [goldPrice, silverPrice, platinumPrice, palladiumPrice, liveSpots] = await Promise.all([
    getLatestPrice("gold"),
    getLatestPrice("silver"),
    getLatestPrice("platinum"),
    getLatestPrice("palladium"),
    fetchAllSpotPrices(),
  ]);

  const [goldHistory, silverHistory, platinumHistory, palladiumHistory] = await Promise.all([
    prisma.price.findMany({
      where: { metal: "gold" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
    prisma.price.findMany({
      where: { metal: "silver" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
    prisma.price.findMany({
      where: { metal: "platinum" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
    prisma.price.findMany({
      where: { metal: "palladium" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
  ]);

  const totalInvested = holdings.reduce((sum, h) => {
    return sum + h.ounces * h.purchasePrice;
  }, 0);

  const spotsUSD: Record<string, number> = {
    gold:      liveSpots.gold      ?? goldPrice?.price      ?? 0,
    silver:    liveSpots.silver    ?? silverPrice?.price    ?? 0,
    platinum:  liveSpots.platinum  ?? platinumPrice?.price  ?? 0,
    palladium: liveSpots.palladium ?? palladiumPrice?.price ?? 0,
  };

  const convertedSpots = await convertPricesFromUSD(
    { Gold: spotsUSD.gold, Silver: spotsUSD.silver, Platinum: spotsUSD.platinum, Palladium: spotsUSD.palladium },
    currency
  );

  const spotMap: Record<string, number> = {
    gold:      convertedSpots.Gold,
    silver:    convertedSpots.Silver,
    platinum:  convertedSpots.Platinum,
    palladium: convertedSpots.Palladium,
  };

  const totalValue = holdings.reduce((sum, h) => {
    const currentPrice = spotMap[h.metal] ?? 0;
    return sum + h.ounces * currentPrice;
  }, 0);

  const totalGainLoss = totalValue - totalInvested;

  const totalPercent =
    totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const metalValues = ["gold", "silver", "platinum", "palladium"].map((metal) => ({
    metal,
    value: holdings
      .filter((h) => h.metal === metal)
      .reduce((sum, h) => sum + h.ounces * (spotMap[metal] ?? 0), 0),
  }));

  const goldValue     = metalValues.find((m) => m.metal === "gold")?.value ?? 0;
  const silverValue   = metalValues.find((m) => m.metal === "silver")?.value ?? 0;
  const platinumValue = metalValues.find((m) => m.metal === "platinum")?.value ?? 0;
  const palladiumValue= metalValues.find((m) => m.metal === "palladium")?.value ?? 0;

  const goldPercent     = totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverPercent   = totalValue > 0 ? (silverValue / totalValue) * 100 : 0;
  const platinumPercent = totalValue > 0 ? (platinumValue / totalValue) * 100 : 0;
  const palladiumPercent= totalValue > 0 ? (palladiumValue / totalValue) * 100 : 0;

  // Pre-compute ounces per metal once
  const ozByMetal: Record<string, number> = {};
  for (const metal of ["gold", "silver", "platinum", "palladium"]) {
    ozByMetal[metal] = holdings
      .filter((h) => h.metal === metal)
      .reduce((sum, h) => sum + h.ounces, 0);
  }

  const portfolioHistory = goldHistory.map((g, i) => {
    const value =
      ozByMetal["gold"]      * (g?.price                  ?? 0) +
      ozByMetal["silver"]    * (silverHistory[i]?.price   ?? 0) +
      ozByMetal["platinum"]  * (platinumHistory[i]?.price ?? 0) +
      ozByMetal["palladium"] * (palladiumHistory[i]?.price ?? 0);
    return value;
  });

  const maxValue = Math.max(...portfolioHistory, 1);

  const points =
    portfolioHistory.length > 1
      ? portfolioHistory
          .map((v, i) => {
            const x = (i / (portfolioHistory.length - 1)) * 100;
            const y = 100 - (v / maxValue) * 100;
            return `${x},${y}`;
          })
          .join(" ")
      : "0,100 100,100";

  const METAL_META = {
    gold:      { label: "Gold",      symbol: "XAU", dot: "#D4AF37" },
    silver:    { label: "Silver",    symbol: "XAG", dot: "#C0C0C0" },
    platinum:  { label: "Platinum",  symbol: "XPT", dot: "#E5E4E2" },
    palladium: { label: "Palladium", symbol: "XPD", dot: "#9FA8C7" },
  };

  const metalSummaries = (["gold", "silver", "platinum", "palladium"] as const)
    .map((metal) => {
      const lots = holdings.filter((h) => h.metal === metal);
      if (lots.length === 0) return null;
      const totalOz       = lots.reduce((s, h) => s + h.ounces, 0);
      const totalCost     = lots.reduce((s, h) => s + h.ounces * h.purchasePrice, 0);
      const avgCost       = totalCost / totalOz;
      const currentSpot   = spotMap[metal] ?? 0;
      const currentValue  = totalOz * currentSpot;
      const gainLoss      = currentValue - totalCost;
      const gainPct       = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
      return { metal, totalOz, avgCost, currentSpot, currentValue, gainLoss, gainPct };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label mb-1">Holdings</p>
            <h1 className="text-3xl font-black tracking-tight">Your Portfolio</h1>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <a
                href="/api/portfolio/export"
                className="border px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/5 min-h-[44px] flex items-center gap-2"
                style={{ borderColor: "var(--gold-glow)", color: "var(--gold)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v7M3 5l3 3 3-3M1 9v1a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export CSV
              </a>
            ) : (
              <Link
                href="/pricing"
                className="border px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/5 min-h-[44px] flex items-center gap-2"
                style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
                title="Upgrade to Pro to export your portfolio"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Export CSV
              </Link>
            )}
            <Link
              href="/dashboard"
              className="border px-4 py-3 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors min-h-[44px] flex items-center"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Performance chart */}
        <div className="border border-white/5 p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <p className="label">Portfolio Performance</p>
          <div className="h-40 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <polyline
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Last 30 price updates</p>
        </div>

        {/* Allocation — stacked percentage bars */}
        {totalValue > 0 && (
          <div className="border border-white/5 p-6 space-y-4" style={{ background: "var(--surface)" }}>
            <p className="label">Allocation</p>
            <div className="space-y-3">
              {[
                { label: "Gold",      pct: goldPercent,      dot: "#D4AF37" },
                { label: "Silver",    pct: silverPercent,    dot: "#C0C0C0" },
                { label: "Platinum",  pct: platinumPercent,  dot: "#E5E4E2" },
                { label: "Palladium", pct: palladiumPercent, dot: "#9FA8C7" },
              ].map(({ label, pct, dot }) => pct > 0 ? (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium" style={{ color: dot }}>{label}</span>
                    <span className="tabular-nums text-gray-400">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: dot }} />
                  </div>
                </div>
              ) : null)}
            </div>
          </div>
        )}

        {/* IRA callout — shown when total portfolio exceeds $10k (Birch Gold minimum) */}
        {totalValue >= 10000 && (process.env.AFFILIATE_BIRCH_URL || process.env.AFFILIATE_AUGUSTA_URL) && (() => {
          // Birch starts at $10K, Augusta at $50K — show the right partner based on portfolio size
          const showAugusta = totalValue >= 50000 && !!process.env.AFFILIATE_AUGUSTA_URL;
          const href = showAugusta
            ? `${process.env.AFFILIATE_AUGUSTA_URL}&sub_id=holdings`
            : `${process.env.AFFILIATE_BIRCH_URL}&sub_id=holdings`;
          const partner = showAugusta ? "Augusta Precious Metals" : "Birch Gold Group";
          return (
            <div className="border border-white/5 p-6 space-y-3" style={{ background: "var(--surface)" }}>
              <p className="label">Tax-advantaged metals</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your stack is large enough to consider a self-directed IRA — hold physical bullion with potential tax advantages, no liquidation required.
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1 text-sm font-semibold link-gold"
              >
                See how it works →
              </a>
              <p className="text-xs text-gray-600 mt-1">{partner} · Paid partner</p>
            </div>
          );
        })()}

        {/* Add Holding form */}
        <div className="border border-white/5 p-6 space-y-5" style={{ background: "var(--surface)" }}>
          <p className="label">Add Holding</p>

          <form action={addHolding} className="grid gap-3 md:grid-cols-4">
            <select
              name="metal"
              required
              className="border px-3 py-2.5 text-base transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
            >
              <option value="">Select Metal</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="palladium">Palladium</option>
            </select>

            <input
              name="ounces"
              type="number"
              step="0.01"
              placeholder="Ounces"
              required
              className="border px-3 py-2.5 text-base transition-colors" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
            />

            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              placeholder="Price per oz"
              required
              className="border px-3 py-2.5 text-base transition-colors" style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
            />

            <input
              name="purchaseDate"
              type="date"
              required
              className="border px-3 py-2.5 text-base transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
            />

            <button
              type="submit"
              className="md:col-span-4 btn-gold py-2.5"
            >
              Add Holding
            </button>
          </form>
        </div>

        {/* Per-metal summary */}
        {metalSummaries.length > 0 && (
          <div className="border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {metalSummaries.map((s, i) => {
              const meta = METAL_META[s.metal];
              const isUp = s.gainLoss >= 0;
              return (
                <div
                  key={s.metal}
                  className={`flex items-center justify-between px-6 py-4 gap-4 ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.dot }} />
                    <div>
                      <p className="text-sm font-bold">{meta.label}</p>
                      <p className="text-xs text-gray-500 tabular-nums">
                        {s.totalOz.toFixed(3)} oz · avg {formatCurrency(s.avgCost, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums">
                      {formatCurrency(s.currentValue, currency)}
                    </p>
                    <p className="text-xs tabular-nums font-medium" style={{ color: isUp ? "var(--gold)" : "#f87171" }}>
                      {isUp ? "+" : ""}{formatCurrency(s.gainLoss, currency)} ({isUp ? "+" : ""}{s.gainPct.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Holdings list */}
        {holdings.length === 0 ? (
          <div className="border border-dashed border-white/10 p-10 text-center space-y-3" style={{ background: "var(--surface)" }}>
            <p className="text-xl font-black tracking-tight">No holdings yet</p>
            <p className="text-sm text-gray-500">Use the form above to add your first position.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {holdings.map((h) => {
              const currentPrice = spotMap[h.metal] ?? 0;
              const value = h.ounces * currentPrice;
              const invested = h.ounces * h.purchasePrice;
              const gainLoss = value - invested;
              const percent = invested > 0 ? (gainLoss / invested) * 100 : 0;

              return (
                <div key={h.id} className="border border-white/5 p-6 space-y-4" style={{ background: "var(--surface)" }}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-black tracking-tight capitalize">{h.metal}</p>
                      <p className="text-sm text-gray-500 mt-0.5 tabular-nums">
                        {h.ounces.toFixed(2)} oz @ {formatCurrency(h.purchasePrice, currency)}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Purchased {new Date(h.purchaseDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tabular-nums">{formatCurrency(value, currency)}</p>
                      <p className="text-sm font-medium tabular-nums mt-0.5" style={{ color: gainLoss >= 0 ? "var(--gold)" : "#f87171" }}>
                        {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss, currency)} ({percent.toFixed(2)}%)
                      </p>
                      <div className="mt-2 h-px w-24 ml-auto overflow-hidden bg-white/5">
                        <div
                          className="h-full"
                          style={{ width: `${Math.min(Math.abs(percent), 100)}%`, backgroundColor: percent >= 0 ? "var(--gold)" : "#f87171" }}
                        />
                      </div>
                    </div>
                  </div>

                  <form action={deleteHolding.bind(null, h.id)}>
                    <button
                      type="submit"
                      className="border border-red-500/20 px-4 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}