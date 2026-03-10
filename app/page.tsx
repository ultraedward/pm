export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import MetalDashboard from "@/components/MetalDashboard";

export type HistoryPoint = {
  price: number;
  timestamp: string;
};

export type MetalData = {
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

function filterSince(
  rows: { price: number; timestamp: Date }[],
  since: Date
) {
  return rows.filter((r) => r.timestamp >= since);
}

async function getMetalData(
  metal: "gold" | "silver"
): Promise<MetalData> {
  const rows = await prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "asc" },
  });

  if (!rows.length) {
    return {
      price: 0,
      percentChange: null,
      history1D: [],
      history7D: [],
      history30D: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const latest = rows[rows.length - 1];

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let history1D = filterSince(rows, oneDayAgo);

  if (history1D.length < 2) {
  history1D = rows.slice(-7);
  }
  const history7D = filterSince(rows, sevenDaysAgo);
  const history30D = filterSince(rows, thirtyDaysAgo);

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
  const [gold, silver] = await Promise.all([
    getMetalData("gold"),
    getMetalData("silver"),
  ]);

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

        <MetalDashboard
          gold={gold}
          silver={silver}
          isPro={false}
        />
      </div>
    </main>
  );
}