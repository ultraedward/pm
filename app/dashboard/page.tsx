import { prisma } from "@/lib/prisma";
import MetalDashboard from "@/components/MetalDashboard";

type PriceRow = { price: number; timestamp: Date };

function formatHistory(rows: PriceRow[]) {
  return rows.map((r) => ({
    price: r.price,
    timestamp: r.timestamp.toISOString(),
  }));
}

async function getMetalData(metal: "gold" | "silver") {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });

  if (!latest) {
    return {
      price: 0,
      percentChange: null as number | null,
      history1D: [],
      history7D: [],
      history30D: [],
    };
  }

  // Chart data (pure ranges)
  const history1D = await prisma.price.findMany({
    where: { metal, timestamp: { gte: oneDayAgo } },
    orderBy: { timestamp: "asc" },
  });

  const history7D = await prisma.price.findMany({
    where: { metal, timestamp: { gte: sevenDaysAgo } },
    orderBy: { timestamp: "asc" },
  });

  const history30D = await prisma.price.findMany({
    where: { metal, timestamp: { gte: thirtyDaysAgo } },
    orderBy: { timestamp: "asc" },
  });

  /**
   * TRUE 24H BASELINE:
   * Get the last price at or before oneDayAgo.
   * This is the correct baseline for a 24h %.
   */
  const baseline24h = await prisma.price.findFirst({
    where: { metal, timestamp: { lte: oneDayAgo } },
    orderBy: { timestamp: "desc" },
  });

  /**
   * If you have no historical point before 24h ago,
   * fall back to the first point we *do* have in the last 24h.
   * If there's still not enough data, return null (not fake 0).
   */
  const baselinePrice =
    baseline24h?.price ??
    (history1D.length > 0 ? history1D[0].price : null);

  const percentChange =
    baselinePrice && baselinePrice !== 0
      ? ((latest.price - baselinePrice) / baselinePrice) * 100
      : null;

  return {
    price: latest.price,
    percentChange,
    history1D: formatHistory(history1D),
    history7D: formatHistory(history7D),
    history30D: formatHistory(history30D),
  };
}

export default async function DashboardPage() {
  const gold = await getMetalData("gold");
  const silver = await getMetalData("silver");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="mx-auto max-w-6xl space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-neutral-400">
            Live gold and silver pricing with smart alerts.
          </p>
        </div>

        <MetalDashboard gold={gold} silver={silver} />
      </div>
    </main>
  );
}