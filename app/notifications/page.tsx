// app/notifications/page.tsx
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const alerts = await prisma.alert.findMany({
    where: { triggered: true },
    include: { metal: true },
    orderBy: { triggeredAt: "desc" },
  });

  return (
    <main className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <table className="w-full border border-gray-800 text-sm">
        <thead className="bg-gray-900">
          <tr>
            <th className="p-2 border border-gray-800">Metal</th>
            <th className="p-2 border border-gray-800">Condition</th>
            <th className="p-2 border border-gray-800">Target</th>
            <th className="p-2 border border-gray-800">Triggered</th>
            <th className="p-2 border border-gray-800">Notified</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id} className="odd:bg-gray-800">
              <td className="p-2 border border-gray-800">{a.metal.name}</td>
              <td className="p-2 border border-gray-800">{a.condition}</td>
              <td className="p-2 border border-gray-800">
                ${a.targetPrice.toFixed(2)}
              </td>
              <td className="p-2 border border-gray-800">
                {a.triggeredAt
                  ? new Date(a.triggeredAt).toLocaleString()
                  : "—"}
              </td>
              <td className="p-2 border border-gray-800">
                {a.notified ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
