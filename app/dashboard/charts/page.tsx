import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (prices.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Charts</h1>
        <p className="mt-4 text-gray-500">
          No spot price cache data found yet.
        </p>
      </div>
    );
  }

  const grouped: Record<string, typeof prices> = {};

  for (const p of prices) {
    if (!grouped[p.metal]) grouped[p.metal] = [];
    grouped[p.metal].push(p);
  }

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
                date: r.createdAt.toISOString().slice(0, 10),
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
