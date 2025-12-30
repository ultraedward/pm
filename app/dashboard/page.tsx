// app/dashboard/page.tsx

"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { useEffect, useState } from "react"

type HistoryPoint = {
  id: string
  price: number
  createdAt: string
  metalId: string
}

type Metal = {
  id: string
  name: string
  price: number
}

export default function DashboardPage() {
  const [metals, setMetals] = useState<Metal[]>([])
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [selectedMetalId, setSelectedMetalId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/cron/move-prices", { cache: "no-store" })

    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        setMetals(data)
        if (data.length && !selectedMetalId) {
          setSelectedMetalId(data[0].id)
        }
      })

    fetch("/api/history")
      .then((r) => r.json())
      .then(setHistory)
  }, [])

  const filteredHistory = history
    .filter((h) => h.metalId === selectedMetalId)
    .reverse()
    .slice(-50)

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metals.map((metal) => (
          <button
            key={metal.id}
            onClick={() => setSelectedMetalId(metal.id)}
            className={`rounded-xl border p-6 text-left transition ${
              selectedMetalId === metal.id
                ? "border-black bg-black text-white"
                : "bg-white"
            }`}
          >
            <div className="text-sm opacity-70">{metal.name}</div>
            <div className="text-3xl font-bold">${metal.price}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-6 bg-white h-[420px]">
        <h2 className="text-lg font-semibold mb-4">Price History</h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredHistory}>
            <XAxis
              dataKey="createdAt"
              tickFormatter={(v) =>
                new Date(v).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              }
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip
              labelFormatter={(v) =>
                new Date(v).toLocaleString()
              }
              formatter={(v) => [`$${v}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
