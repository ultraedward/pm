import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  });

  if (!user) {
    return (
      <div className="p-10 text-white">
        User not found
      </div>
    );
  }

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const [goldPrice, silverPrice, platinumPrice, palladiumPrice] = await Promise.all([
    getLatestPrice("gold"),
    getLatestPrice("silver"),
    getLatestPrice("platinum"),
    getLatestPrice("palladium"),
  ]);

  const [goldHistory, silverHistory] = await Promise.all([
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
  ]);

  const totalInvested = holdings.reduce((sum, h) => {
    return sum + h.ounces * h.purchasePrice;
  }, 0);

  const spotMap: Record<string, number> = {
    gold:      goldPrice?.price      ?? 0,
    silver:    silverPrice?.price    ?? 0,
    platinum:  platinumPrice?.price  ?? 0,
    palladium: palladiumPrice?.price ?? 0,
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

  const portfolioHistory = goldHistory.map((g, i) => {
    const s = silverHistory[i];
    const goldOunces = holdings
      .filter((h) => h.metal === "gold")
      .reduce((sum, h) => sum + h.ounces, 0);

    const silverOunces = holdings
      .filter((h) => h.metal === "silver")
      .reduce((sum, h) => sum + h.ounces, 0);

    const value =
      goldOunces * (g?.price ?? 0) +
      silverOunces * (s?.price ?? 0);

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
    <main className="min-h-screen bg-surface p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="label mb-1">Holdings</p>
            <h1 className="text-3xl font-black tracking-tight">Your Portfolio</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Performance chart */}
        <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
          <p className="label">Portfolio Performance</p>
          <div className="h-40 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Last 30 price updates</p>
        </div>

        {/* Allocation */}
        {totalValue > 0 && (
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-6">
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

            <div className="flex justify-center pt-2">
              <div className="relative h-36 w-36">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #D4AF37 0% ${goldPercent}%,
                      #C0C0C0 ${goldPercent}% ${goldPercent + silverPercent}%,
                      #E5E4E2 ${goldPercent + silverPercent}% ${goldPercent + silverPercent + platinumPercent}%,
                      #9FA8C7 ${goldPercent + silverPercent + platinumPercent}% 100%
                    )`,
                  }}
                />
                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gray-950 text-xs text-gray-500 text-center leading-snug">
                  {goldPercent.toFixed(0)}%<br />gold
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Holding form */}
        <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-5">
          <p className="label">Add Holding</p>

          <form action={addHolding} className="grid gap-3 md:grid-cols-4">
            <select
              name="metal"
              required
              className="rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
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
              className="rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
            />

            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              placeholder="Price per oz"
              required
              className="rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
            />

            <input
              name="purchaseDate"
              type="date"
              required
              className="rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            />

            <button
              type="submit"
              className="md:col-span-4 rounded-full bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
            >
              Add Holding
            </button>
          </form>
        </div>

        {/* Per-metal summary */}
        {metalSummaries.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
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
                        {s.totalOz.toFixed(3)} oz · avg ${s.avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums">
                      ${s.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs tabular-nums font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}${s.gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isUp ? "+" : ""}{s.gainPct.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Holdings list */}
        {holdings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-gray-950 p-10 text-center space-y-3">
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
                <div key={h.id} className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-black tracking-tight capitalize">{h.metal}</p>
                      <p className="text-sm text-gray-500 mt-0.5 tabular-nums">
                        {h.ounces.toFixed(2)} oz @ ${h.purchasePrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Purchased {new Date(h.purchaseDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tabular-nums">${value.toFixed(2)}</p>
                      <p className={`text-sm font-medium tabular-nums mt-0.5 ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {gainLoss >= 0 ? "+" : ""}${gainLoss.toFixed(2)} ({percent.toFixed(2)}%)
                      </p>
                      <div className="mt-2 h-1 w-24 ml-auto overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${percent >= 0 ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${Math.min(Math.abs(percent), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <form action={deleteHolding.bind(null, h.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-red-500/20 px-4 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
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
    </main>
  );
}