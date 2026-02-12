import { prisma } from "@/lib/prisma";
import MetalDashboard from "@/components/MetalDashboard";

async function getHistory(metal: "gold" | "silver") {
  const prices = await prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "asc" },
    take: 200,
  });

  return prices.map((p) => ({
    price: p.price,
    timestamp: p.timestamp,
  }));
}

export default async function HomePage() {
  const goldHistory = await getHistory("gold");
  const silverHistory = await getHistory("silver");

  return (
    <div className="mx-auto max-w-6xl p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Precious Metals
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time gold and silver tracking.
        </p>
      </div>

      <MetalDashboard
        goldHistory={goldHistory}
        silverHistory={silverHistory}
      />
    </div>
  );
}