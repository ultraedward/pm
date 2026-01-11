// app/dashboard/charts/ChartsClient.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
  ResponsiveContainer,
} from "recharts"

type RangeKey = "24h" | "7d" | "30d"

type PricePoint = {
  t: number
  price: number
}

type AlertTrigger = {
  t: number
  price: number
  metal: string
}

type ApiResponse = {
  prices: Record<string, PricePoint[]>
  alertTriggers: AlertTrigger[]
}

export default function ChartsClient() {
  const params = useSearchParams()
  const range = (params.get("range") as RangeKey) || "24h"

  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dashboard?range=${range}`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [range])

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading chart…</div>
  }

  if (!data) {
    return <div className="p-6 text-sm text-red-500">No data</div>
  }

  const metal = "gold"
  const prices = data.prices[metal] ?? []

  const triggerDots = data.alertTriggers
    .filter(t => t.metal === metal)
    .map(t => ({
      t: t.t,
      price: t.price,
    }))

  return (
    <div className="p-6 h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            tickFormatter={v => new Date(v).toLocaleTimeString()}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={v => new Date(Number(v)).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="price"
            strokeWidth={2}
            dot={false}
          />
          <Scatter
            data={triggerDots}
            dataKey="price"
            shape="circle"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
