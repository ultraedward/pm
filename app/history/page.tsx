import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
  searchParams?: { days?: string };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const days = Number(searchParams?.days ?? 7);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const prices = await prisma.price.findMany({
    where: {
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    include: {
      metal: true,
    },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Price History (Last {days} Days)</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-2 border border-gray-700">Metal</th>
              <th className="p-2 border border-gray-700">Price</th>
              <th className="p-2 border border-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.id} className="odd:bg-gray-800">
                <td className="p-2 border border-gray-700">
                  {p.metal.name}
                </td>
                <td className="p-2 border border-gray-700">
                  ${p.price.toFixed(2)}
                </td>
                <td className="p-2 border border-gray-700">
                  {p.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
