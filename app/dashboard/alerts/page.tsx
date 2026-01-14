"use client"

import { useEffect, useState } from "react"

type Alert = {
  id: string
  metal: string
  targetPrice: number
  direction: "ABOVE" | "BELOW"
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metal, setMetal] = useState("gold")
  const [targetPrice, setTargetPrice] = useState("")
  const [direction, setDirection] = useState<"ABOVE" | "BELOW">("ABOVE")

  async function loadAlerts() {
    const res = await fetch("/api/alerts")
    if (!res.ok) return
    const data = await res.json()
    setAlerts(Array.isArray(data) ? data : [])
  }

  async function createAlert() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metal, targetPrice, direction }),
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
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>

      {/* Create */}
      <div className="flex gap-2 mb-6">
        <select
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="palladium">Palladium</option>
        </select>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as any)}
          className="border px-2 py-1"
        >
          <option value="ABOVE">Above</option>
          <option value="BELOW">Below</option>
        </select>

        <input
          placeholder="Price"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="border px-2 py-1 w-24"
        />

        <button
          onClick={createAlert}
          className="border px-3 py-1 bg-white"
        >
          Add
        </button>
      </div>

      {/* List */}
      {alerts.length === 0 && <p>No alerts yet</p>}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center border p-2"
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
