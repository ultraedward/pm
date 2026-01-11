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

export default function ChartsPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("Charts page mounted")

    fetch("/api/prices/current")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed")
        return r.json()
      })
      .then((d) => {
        console.log("Prices loaded", d)
        setData(d.prices)
      })
      .catch((e) => {
        console.error(e)
        setError("FETCH FAILED")
      })
  }, [])

  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-10">
      {Object.entries(data).map(([metal, points]: any) => (
        <div key={metal} className="h-72">
          <h2 className="mb-2 font-semibold capitalize">{metal}</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <XAxis dataKey="t" />
              <YAxis />
              <Tooltip />
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
