import { prisma } from "@/lib/prisma";
import MetalDashboard from "@/components/MetalDashboard";

type HistoryPoint = {
  price: number;
  timestamp: string;
};

type MetalData = {
  price: number;
  percentChange: number | null;
  history1D: HistoryPoint[];
  history7D: HistoryPoint[];
  history30D: HistoryPoint[];
  lastUpdated: string;
};

function formatHistory(
  rows: { price: number; timestamp: Date }[]
): HistoryPoint[] {
  return rows.map((r) => ({
    price: r.price,
    timestamp: r.timestamp.toISOString(),
  }));
}

async function getMetalData(
  metal: "gold" | "silver"
): Promise<MetalData> {
  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });

  if (!latest) {
    return {
      price: 0,
      percentChange: null,
      history1D: [],
      history7D: [],
      history30D: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

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

  const baseline = history1D[0];

  const percentChange =
    baseline && baseline.price !== 0
      ? ((latest.price - baseline.price) / baseline.price) * 100
      : null;

  return {
    price: latest.price,
    percentChange,
    history1D: formatHistory(history1D),
    history7D: formatHistory(history7D),
    history30D: formatHistory(history30D),
    lastUpdated: latest.timestamp.toISOString(),
  };
}

export default async function HomePage() {
  const gold = await getMetalData("gold");
  const silver = await getMetalData("silver");

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl space-y-12">
        <div>
          <h1 className="text-4xl font-bold">
            Live Precious Metals
          </h1>
          <p className="mt-2 text-neutral-400">
            Real-time gold and silver pricing.
          </p>
        </div>

        {/* IMPORTANT: Marketing page is NOT Pro */}
        <MetalDashboard
          gold={gold}
          silver={silver}
          isPro={false}
        />
      </div>
    </main>
  );
}