"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts"

type RangeKey = "24h" | "7d" | "30d"

type PricePoint = {
  t: number
  price: number
}

type TriggerPoint = {
  t: number
  price: number
  metal: string
}

const RANGE_MS: Record<RangeKey, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
}

const COLORS: Record<string, string> = {
  gold: "#d97706",
  silver: "#6b7280",
  platinum: "#2563eb",
  palladium: "#7c3aed",
}

export default function ChartsPage() {
  const [prices, setPrices] = useState<Record<string, PricePoint[]>>({})
  const [triggers, setTriggers] = useState<TriggerPoint[]>([])
  const [range, setRange] = useState<RangeKey>("24h")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/prices/current").then((r) => r.json()),
      fetch("/api/dashboard").then((r) => r.json()),
    ]).then(([priceData, dashboardData]) => {
      setPrices(priceData.prices || {})
      setTriggers(dashboardData.alertTriggers || [])
      setLoading(false)
    })
  }, [])

  const cutoff = Date.now() - RANGE_MS[range]

  const filteredPrices = useMemo(() => {
    const out: Record<string, PricePoint[]> = {}
    for (const [metal, points] of Object.entries(prices)) {
      out[metal] = points.filter((p) => p.t >= cutoff)
    }
    return out
  }, [prices, cutoff])

  const filteredTriggers = useMemo(
    () => triggers.filter((t) => t.t >= cutoff),
    [triggers, cutoff]
  )

  const lastPrices = useMemo(() => {
    const out: Record<string, number> = {}
    for (const [metal, pts] of Object.entries(filteredPrices)) {
      if (pts.length > 0) {
        out[metal] = pts[pts.length - 1].price
      }
    }
    return out
  }, [filteredPrices])

  if (loading) {
    return <div className="p-6">Loading charts…</div>
  }

  return (
    <div className="p-6 space-y-8">
      {/* RANGE SELECTOR */}
      <div className="flex gap-2">
        {(["24h", "7d", "30d"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded border text-sm ${
              range === r
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries(lastPrices).map(([metal, price]) => (
          <div
            key={metal}
            className="flex items-center gap-2 border rounded px-3 py-1"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[metal] || "#000" }}
            />
            <span className="capitalize font-medium">{metal}</span>
            <span className="text-gray-600">
              ${price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      {Object.entries(filteredPrices).map(([metal, points]) => {
        if (points.length === 0) return null

        const metalTriggers = filteredTriggers.filter(
          (t) => t.metal === metal
        )

        return (
          <div key={metal}>
            <h2 className="mb-2 font-bold capitalize">
              {metal} ({range})
            </h2>

            <LineChart width={800} height={300} data={points}>
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
                stroke={COLORS[metal] || "#000"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              {/* ALERT DOTS */}
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
