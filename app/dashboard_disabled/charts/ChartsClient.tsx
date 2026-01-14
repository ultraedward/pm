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

export default function ChartsClient() {
  const [data, setData] = useState<Record<string, Point[]>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/prices", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load prices")
        return r.json()
      })
      .then((json) => setData(json.prices))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!Object.keys(data).length)
    return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-12">
      {Object.entries(data).map(([metal, points]) => (
        <div key={metal}>
          <h2 className="mb-2 text-xl font-semibold capitalize">
            {metal}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={points}>
              <XAxis
                dataKey="t"
                tickFormatter={(t) =>
                  new Date(t).toLocaleTimeString()
                }
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => v.toFixed(0)}
              />
              <Tooltip
                labelFormatter={(t) =>
                  new Date(Number(t)).toLocaleString()
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}
