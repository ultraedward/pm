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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch("/api/alerts")
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()

        // 🔒 HARD GUARANTEE ARRAY
        setAlerts(Array.isArray(data) ? data : [])
      } catch (e) {
        setError("Failed to load alerts")
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [])

  async function deleteAlert(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" })
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return <div>Loading alerts…</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Your Alerts</h1>

      {alerts.length === 0 && <div>No alerts yet.</div>}

      <ul className="space-y-2">
        {alerts.map(alert => (
          <li
            key={alert.id}
            className="flex justify-between gap-2 border p-2 rounded"
          >
            <span>
              {alert.metal} {alert.direction} {alert.targetPrice}
            </span>
            <button onClick={() => deleteAlert(alert.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
