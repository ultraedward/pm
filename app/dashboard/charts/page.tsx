"use client"

export const dynamic = "force-dynamic"

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

export default function ChartsPage() {
  const [prices, setPrices] = useState<Record<string, Point[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/prices/current")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed")
        return res.json()
      })
      .then((data) => {
        setPrices(data.prices || {})
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load prices")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-6">Loading charts…</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6 space-y-10">
      {Object.keys(prices).length === 0 && (
        <div>No price data yet</div>
      )}

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
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}
