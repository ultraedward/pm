"use client"

import { useEffect, useState } from "react"

type Alert = {
  id: string
  metal: string
  direction: "ABOVE" | "BELOW"
  targetPrice: number
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch("/api/alerts", { cache: "no-store" })
    const data = await res.json()
    setAlerts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" })
    setAlerts((a) => a.filter((x) => x.id !== id))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="p-4">Loading…</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Alerts</h1>

      {alerts.length === 0 && (
        <div className="text-sm text-gray-500">No alerts yet</div>
      )}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <span>
              {a.metal} {a.direction} {a.targetPrice}
            </span>
            <button
              onClick={() => remove(a.id)}
              className="text-red-600 hover:underline"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
