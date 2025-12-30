import LiveDashboardClient from "./components/LiveDashboardClient";
import { prisma } from "../lib/prisma";
import StatBadge from "./components/StatBadge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const metals = await prisma.metal.findMany({
    include: { prices: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return (
    <main className="p-4 md:p-8 min-h-screen">
      <section className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Precious Metals
        </h1>
        <p className="text-gray-400 mt-1">
          Live prices · alerts · system health
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {metals.map((m) => (
          <StatBadge
            key={m.id}
            label={m.name}
            value={`$${m.prices[0]?.price.toFixed(2)}`}
          />
        ))}
      </section>

      <LiveDashboardClient />
    </main>
  );
}
