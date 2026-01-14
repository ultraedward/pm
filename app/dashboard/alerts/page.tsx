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
  const [metal, setMetal] = useState("gold")
  const [direction, setDirection] = useState<"ABOVE" | "BELOW">("ABOVE")
  const [targetPrice, setTargetPrice] = useState("")

  async function loadAlerts() {
    const res = await fetch("/api/alerts")
    const data = await res.json()
    setAlerts(Array.isArray(data) ? data : [])
  }

  async function createAlert() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metal,
        direction,
        targetPrice: Number(targetPrice),
      }),
    })
    setTargetPrice("")
    loadAlerts()
  }

  async function deleteAlert(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" })
    loadAlerts()
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Price Alerts</h1>

      <div className="flex gap-2">
        <select value={metal} onChange={e => setMetal(e.target.value)}>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="palladium">Palladium</option>
        </select>

        <select
          value={direction}
          onChange={e => setDirection(e.target.value as any)}
        >
          <option value="ABOVE">Above</option>
          <option value="BELOW">Below</option>
        </select>

        <input
          value={targetPrice}
          onChange={e => setTargetPrice(e.target.value)}
          placeholder="Target price"
        />

        <button onClick={createAlert}>Add</button>
      </div>

      <ul className="space-y-2">
        {alerts.map(a => (
          <li
            key={a.id}
            className="flex justify-between border p-2 rounded"
          >
            <span>
              {a.metal} {a.direction} {a.targetPrice}
            </span>
            <button onClick={() => deleteAlert(a.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
