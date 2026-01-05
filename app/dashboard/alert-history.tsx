import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertHistory() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      price: true,
      createdAt: true,
      alert: {
        select: {
          metal: true,
          direction: true,
          threshold: true,
        },
      },
    },
  });

  const rows = triggers.map((t) => ({
    id: t.id,
    metal: t.alert.metal,
    direction: t.alert.direction,
    threshold: t.alert.threshold,
    price: t.price,
    createdAt: t.createdAt,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Alert History</h2>

      {rows.length === 0 ? (
        <div className="text-gray-500">No alerts have triggered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Metal</th>
                <th className="border px-3 py-2 text-left">Direction</th>
                <th className="border px-3 py-2 text-right">Threshold</th>
                <th className="border px-3 py-2 text-right">Price</th>
                <th className="border px-3 py-2 text-left">Triggered At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="border px-3 py-2">{r.metal}</td>
                  <td className="border px-3 py-2">{r.direction}</td>
                  <td className="border px-3 py-2 text-right">
                    {r.threshold}
                  </td>
                  <td className="border px-3 py-2 text-right">{r.price}</td>
                  <td className="border px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
