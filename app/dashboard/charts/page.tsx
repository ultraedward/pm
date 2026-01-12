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
  Legend,
} from "recharts"

type RangeKey = "24h" | "7d" | "30d"
type Mode = "price" | "pct"

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
  const [mode, setMode] = useState<Mode>("price")
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

  const combinedData = useMemo(() => {
    const map = new Map<number, any>()

    for (const [metal, pts] of Object.entries(prices)) {
      const filtered = pts.filter((p) => p.t >= cutoff)
      if (filtered.length === 0) continue

      const base = filtered[0].price || 1

      for (const p of filtered) {
        if (!map.has(p.t)) map.set(p.t, { t: p.t })
        const row = map.get(p.t)

        row[metal] =
          mode === "price"
            ? p.price
            : ((p.price - base) / base) * 100
      }
    }

    return Array.from(map.values()).sort((a, b) => a.t - b.t)
  }, [prices, cutoff, mode])

  const triggerPoints = useMemo(() => {
    return triggers
      .filter((t) => t.t >= cutoff)
      .map((t) => ({
        t: t.t,
        [t.metal]:
          mode === "price" ? t.price : 0, // plotted at baseline for pct
        metal: t.metal,
      }))
  }, [triggers, cutoff, mode])

  if (loading) return <div className="p-6">Loading charts…</div>

  return (
    <div className="p-6 space-y-6">
      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 items-center">
        {(["24h", "7d", "30d"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded border text-sm ${
              range === r ? "bg-black text-white" : "bg-white"
            }`}
          >
            {r}
          </button>
        ))}

        <div className="ml-4 flex gap-2">
          <button
            onClick={() => setMode("price")}
            className={`px-3 py-1 rounded border text-sm ${
              mode === "price" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Price $
          </button>
          <button
            onClick={() => setMode("pct")}
            className={`px-3 py-1 rounded border text-sm ${
              mode === "pct" ? "bg-black text-white" : "bg-white"
            }`}
          >
            % Change
          </button>
        </div>
      </div>

      {/* CHART */}
      <LineChart width={900} height={400} data={combinedData}>
        <XAxis
          dataKey="t"
          tickFormatter={(t) =>
            new Date(t).toLocaleTimeString()
          }
        />
        <YAxis
          tickFormatter={(v) =>
            mode === "pct" ? `${v.toFixed(1)}%` : `$${v}`
          }
        />
        <Tooltip
          formatter={(v: any) =>
            mode === "pct"
              ? `${v.toFixed(2)}%`
              : `$${Number(v).toFixed(2)}`
          }
          labelFormatter={(t) =>
            new Date(Number(t)).toLocaleString()
          }
        />
        <Legend />

        {Object.keys(COLORS).map((metal) => (
          <Line
            key={metal}
            type="monotone"
            dataKey={metal}
            stroke={COLORS[metal]}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}

        {triggerPoints.map((p, i) => (
          <Scatter
            key={i}
            data={[p]}
            fill="#dc2626"
          />
        ))}
      </LineChart>
    </div>
  )
}
