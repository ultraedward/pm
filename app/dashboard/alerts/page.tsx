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

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data)
        } else {
          setAlerts([])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function deleteAlert(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) {
    return <p>Loading alerts…</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Alerts</h1>

      {alerts.length === 0 && <p>No alerts yet</p>}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {a.metal} {a.direction} {a.targetPrice}
            </span>
            <button
              onClick={() => deleteAlert(a.id)}
              className="text-red-500"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
