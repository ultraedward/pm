"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type Point = { t: number; price: number }

export default function ChartsPage() {
  const [prices, setPrices] = useState<Record<string, Point[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Charts page mounted")

    fetch("/api/prices/current")
      .then((res) => res.json())
      .then((data) => {
        console.log("Prices loaded", data)
        setPrices(data.prices || {})
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-6">Loading charts…</div>
  }

  return (
    <div className="p-6 space-y-12">
      {Object.entries(prices).map(([metal, points]) => (
        <div key={metal}>
          <h2 className="mb-2 font-bold capitalize">{metal}</h2>

          {/* DEBUG BORDER */}
          <div style={{ border: "2px solid red", display: "inline-block" }}>
            <LineChart
              width={800}
              height={300}
              data={points}
            >
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
                strokeWidth={2}
                dot
                isAnimationActive={false}
              />
            </LineChart>
          </div>
        </div>
      ))}
    </div>
  )
}
