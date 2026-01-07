import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Alerts</h1>

      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="border rounded p-3 text-sm flex justify-between"
          >
            <span>
              {alert.metal} @ {alert.targetPrice}
            </span>
            <span className="text-gray-500">
              {new Date(alert.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
