// app/dashboard/alerts/page.tsx

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Alerts</h1>

      {alerts.length === 0 && (
        <p className="text-gray-500">No alerts yet.</p>
      )}

      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="flex justify-between rounded border p-3"
          >
            <span>
              {alert.metal} @ {alert.target}
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
