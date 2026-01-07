import Link from "next/link"
import Sparkline from "./Sparkline"

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
  const ranges: RangeKey[] = ["24h", "7d", "30d"]

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap gap-10">
        {prices.map((p) => {
          const isUp = p.changePct !== null && p.changePct >= 0

          return (
            <div key={p.metal} className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-gray-400">
                {p.metal}
              </div>

              <div className="flex items-end gap-3">
                <div className="text-2xl font-semibold">
                  ${p.price.toFixed(2)}
                </div>

                <Sparkline
                  points={p.spark}
                  alerts={p.alerts}
                  up={isUp}
                />
              </div>

              <div
                className={`text-sm font-medium ${
                  p.changePct === null
                    ? "text-gray-400"
                    : isUp
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {p.changePct === null
                  ? "—"
                  : `${isUp ? "+" : ""}${p.changePct.toFixed(2)}%`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
