import Sparkline from "./Sparkline"

type SparkPoint = {
  t: number
  p: number
}

type PriceWithSparkline = {
  metal: string
  price: number
  change24h: number | null
  spark: SparkPoint[]
}

export default function PriceHeader({
  prices,
}: {
  prices: PriceWithSparkline[]
}) {
  return (
    <div className="flex flex-wrap gap-10">
      {prices.map((p) => {
        const isUp = p.change24h !== null && p.change24h >= 0

        return (
          <div key={p.metal} className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              {p.metal}
            </div>

            <div className="flex items-end gap-3">
              <div className="text-2xl font-semibold">
                ${p.price.toFixed(2)}
              </div>

              <Sparkline points={p.spark} up={isUp} />
            </div>

            <div
              className={`text-sm font-medium ${
                p.change24h === null
                  ? "text-gray-400"
                  : isUp
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {p.change24h === null
                ? "—"
                : `${isUp ? "+" : ""}${p.change24h.toFixed(2)}%`}
            </div>
          </div>
        )
      })}
    </div>
  )
}
