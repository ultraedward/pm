"use client"

import { useState } from "react"
import Link from "next/link"
import Sparkline from "./Sparkline"
import ExpandedChart from "./ExpandedChart"
import PaywallModal from "./PaywallModal"

type SparkPoint = { t: number; v: number }
type AlertLine = { v: number }

type PriceWithSparkline = {
  metal: string
  price: number
  changePct: number | null
  spark: SparkPoint[]
  alerts: AlertLine[]
}

type RangeKey = "24h" | "7d" | "30d"

export default function PriceHeader({
  prices,
  range,
}: {
  prices: PriceWithSparkline[]
  range: RangeKey
}) {
  const [openMetal, setOpenMetal] = useState<string | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)

  // 🔒 FEATURE FLAG (later replaces with real entitlement)
  const canExport = false

  const ranges: RangeKey[] = ["24h", "7d", "30d"]

  function onExport() {
    if (!canExport) {
      setShowPaywall(true)
      return
    }
    window.location.href = `/api/export/prices?range=${range}`
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {ranges.map((r) => (
            <Link
              key={r}
              href={`/dashboard?range=${r}`}
              className={`px-3 py-1 rounded text-sm ${
                r === range
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {r}
            </Link>
          ))}
        </div>

        <button
          onClick={onExport}
          className="ml-auto px-3 py-1 text-sm rounded border border-gray-600 hover:bg-gray-800"
        >
          Export CSV
        </button>
      </div>

      {/* Prices */}
      {prices.map((p) => {
        const isUp = p.changePct !== null && p.changePct >= 0
        const open = openMetal === p.metal

        return (
          <div key={p.metal} className="space-y-3">
            <button
              onClick={() =>
                setOpenMetal(open ? null : p.metal)
              }
              className="w-full text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 text-xs uppercase text-gray-400">
                  {p.metal}
                </div>

                <div className="text-2xl font-semibold">
                  ${p.price.toFixed(2)}
                </div>

                <Sparkline
                  points={p.spark}
                  alerts={p.alerts}
                  up={isUp}
                />

                <div
                  className={`text-sm font-medium ${
                    isUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {p.changePct?.toFixed(2)}%
                </div>
              </div>
            </button>

            {open && (
              <ExpandedChart
                points={p.spark}
                alerts={p.alerts}
              />
            )}
          </div>
        )
      })}

      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} />
      )}
    </div>
  )
}
