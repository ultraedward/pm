"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts"

type PricePoint = { t: number; price: number }
type TriggerPoint = { t: number; price: number; metal: string }

export default function ChartsPage() {
  const [prices, setPrices] = useState<Record<string, PricePoint[]>>({})
  const [triggers, setTriggers] = useState<TriggerPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/prices/current").then((r) => r.json()),
      fetch("/api/dashboard").then((r) => r.json()),
    ]).then(([priceData, dashboardData]) => {
      setPrices(priceData.prices || [])
      setTriggers(dashboardData.alertTriggers || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="p-6">Loading charts…</div>
  }

  return (
    <div className="p-6 space-y-16">
      {Object.entries(prices).map(([metal, points]) => {
        const metalTriggers = triggers.filter(
          (t) => t.metal === metal
        )

        return (
          <div key={metal}>
            <h2 className="mb-2 font-bold capitalize">{metal}</h2>

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

              {/* PRICE LINE */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              {/* ALERT TRIGGER DOTS */}
              <Scatter
                data={metalTriggers}
                fill="#dc2626"
              />
            </LineChart>
          </div>
        )
      })}
    </div>
  )
}
