import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
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
  const oneDayAgo = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  );
  const sevenDaysAgo = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  );

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

  // Find first price ~24h ago for proper baseline
  const baseline =
    history1D.find(
      (r) => new Date(r.timestamp) <= oneDayAgo
    ) || history1D[0];

  const percentChange =
    baseline && baseline.price !== 0
      ? ((latest.price - baseline.price) /
          baseline.price) *
        100
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

export default async function DashboardPage() {
  const user = await requireUser();

  const gold = await getMetalData("gold");
  const silver = await getMetalData("silver");

  const isPro = user.subscriptionStatus === "active";

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl space-y-12">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>
          <p className="mt-2 text-neutral-400">
            Live gold and silver pricing.
          </p>
        </div>

        <MetalDashboard
          gold={gold}
          silver={silver}
          isPro={isPro}
        />
      </div>
    </main>
  );
}