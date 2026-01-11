"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type Point = { t: number; price: number }
type ApiResponse = {
  prices: Record<string, Point[]>
}

export default function ChartsPage() {
  const [prices, setPrices] = useState<Record<string, Point[]>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/prices/current")
      .then((r) => {
        if (!r.ok) throw new Error("Fetch failed")
        return r.json()
      })
      .then((data: ApiResponse) => {
        setPrices(data.prices || {})
      })
      .catch((e) => {
        console.error("DASHBOARD FETCH ERROR", e)
        setError("Failed to load prices")
      })
  }, [])

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6 space-y-10">
      {Object.entries(prices).map(([metal, points]) => (
        <div key={metal} className="h-72">
          <h2 className="mb-2 font-semibold capitalize">{metal}</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <XAxis
                dataKey="t"
                tickFormatter={(t) =>
                  new Date(t).toLocaleTimeString()
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(t) =>
                  new Date(Number(t)).toLocaleString()
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}
