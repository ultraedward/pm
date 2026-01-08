// app/dev/simulate-trigger/page.tsx
// FULL SHEET — REPLACE THIS FILE COMPLETELY

import { prisma } from "@/lib/prisma"

export default async function SimulateTriggerPage() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: {
      triggeredAt: "desc", // ✅ FIX: correct field name
    },
    take: 10,
    select: {
      id: true,
      metal: true,
      price: true,
      triggeredAt: true,
      userId: true,
    },
  })

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Simulated Alert Triggers
      </h1>

      {triggers.length === 0 ? (
        <div className="text-sm text-gray-400">
          No triggers found.
        </div>
      ) : (
        <div className="space-y-2">
          {triggers.map((t) => (
            <div
              key={t.id}
              className="flex justify-between text-sm border-b border-gray-800 py-1"
            >
              <span className="uppercase text-gray-400">
                {t.metal}
              </span>

              <span>
                ${Number(t.price).toFixed(2)}
              </span>

              <span className="text-gray-500">
                {new Date(t.triggeredAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
