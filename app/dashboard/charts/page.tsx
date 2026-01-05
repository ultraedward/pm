import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  // 🔴 Prisma client on Vercel is stale — access dynamically
  const client = prisma as any;

  if (!client.spotPriceCache) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Charts</h1>
        <p className="mt-4 text-gray-500">
          Spot price cache model not available yet.
        </p>
      </div>
    );
  }

  const prices = await client.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (!prices || prices.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Charts</h1>
        <p className="mt-4 text-gray-500">
          No spot price cache data found yet.
        </p>
      </div>
    );
  }

  const grouped = prices.reduce<Record<string, typeof prices>>(
    (acc, p) => {
      acc[p.metal] ||= [];
      acc[p.metal].push(p);
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Charts</h1>

      {Object.entries(grouped).map(([metal, rows]) => (
        <div key={metal} className="border rounded p-4">
          <h2 className="text-lg font-semibold capitalize">{metal}</h2>

          <div className="mt-2 text-sm text-gray-600">
            {rows.length} data points
          </div>

          <pre className="mt-4 bg-gray-50 p-3 rounded text-xs overflow-x-auto">
            {JSON.stringify(
              rows.map((r) => ({
                date: new Date(r.createdAt).toISOString().slice(0, 10),
                price: r.price,
              })),
              null,
              2
            )}
          </pre>
        </div>
      ))}
    </div>
  );
}
