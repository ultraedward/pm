import { prisma } from "@/lib/prisma";
import MetalDashboard from "@/components/MetalDashboard";

export const revalidate = 60; // ⏱ Auto refresh every 60 seconds

function formatHistory(rows: { price: number; timestamp: Date }[]) {
  return rows.map((r) => ({
    price: r.price,
    timestamp: r.timestamp.toISOString(),
  }));
}

async function getMetalData(metal: "gold" | "silver") {
  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });

  if (!latest) {
    return {
      price: 0,
      percentChange: 0,
      lastUpdated: null,
      history1D: [],
      history7D: [],
      history30D: [],
    };
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const history1D = await prisma.price.findMany({
    where: {
      metal,
      timestamp: { gte: oneDayAgo },
    },
    orderBy: { timestamp: "asc" },
  });

  const history7D = await prisma.price.findMany({
    where: {
      metal,
      timestamp: { gte: sevenDaysAgo },
    },
    orderBy: { timestamp: "asc" },
  });

  const history30D = await prisma.price.findMany({
    where: {
      metal,
      timestamp: { gte: thirtyDaysAgo },
    },
    orderBy: { timestamp: "asc" },
  });

  // Find price closest to 24h ago
  const first24h =
    history1D.find((r) => r.timestamp <= oneDayAgo) ||
    history1D[0];

  const percentChange =
    first24h && first24h.price !== 0
      ? ((latest.price - first24h.price) / first24h.price) * 100
      : 0;

  return {
    price: latest.price,
    percentChange,
    lastUpdated: latest.timestamp.toISOString(),
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
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-neutral-400">
            Live gold and silver pricing with smart alerts.
          </p>
        </div>

        <MetalDashboard gold={gold} silver={silver} />
      </div>
    </main>
  );
}