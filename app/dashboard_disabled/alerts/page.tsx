// app/dashboard/alerts/page.tsx
// FULL SHEET — REPLACE THIS FILE COMPLETELY

import { prisma } from "@/lib/prisma"

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      metal: true,
      target: true,
      direction: true,
      createdAt: true,
    },
  })

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-400">
        No alerts yet.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Your Alerts</h1>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex justify-between items-center border-b border-gray-800 py-2 text-sm"
          >
            <span>
              {alert.metal.toUpperCase()} @{" "}
              {Number(alert.target).toFixed(2)}
            </span>

            <span className="text-gray-500">
              {alert.direction}
            </span>

            <span className="text-gray-500">
              {new Date(alert.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
