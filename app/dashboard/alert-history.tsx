// app/dashboard/alert-history.tsx
// FULL SHEET — REPLACE ENTIRE FILE

import { prisma } from "@/lib/prisma"

export async function getAlertHistory() {
  return prisma.alertTrigger.findMany({
    orderBy: {
      triggeredAt: "desc", // ✅ FIX: correct field name
    },
    take: 50,
    select: {
      id: true,
      metal: true,
      price: true,
      triggeredAt: true,
      userId: true,
    },
  })
}

export default async function AlertHistory() {
  const rows = await getAlertHistory()

  if (rows.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        No alert history yet.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Alert History</h2>

      <div className="space-y-1">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex justify-between text-sm border-b border-gray-800 py-1"
          >
            <div className="uppercase text-gray-400">
              {r.metal}
            </div>

            <div>${Number(r.price).toFixed(2)}</div>

            <div className="text-gray-500">
              {new Date(r.triggeredAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
