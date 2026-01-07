import { prisma } from "@/lib/prisma"
import PriceHeader from "./PriceHeader"

type SparkPoint = {
  t: number
  p: number
}

type PriceWithSparkline = {
  metal: string
  price: number
  changePct: number | null
  spark: SparkPoint[]
}

type RangeKey = "24h" | "7d" | "30d"

const RANGE_TO_HOURS: Record<RangeKey, number> = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: RangeKey }
}) {
  const range: RangeKey = searchParams.range ?? "24h"
  const hours = RANGE_TO_HOURS[range]

  const now = new Date()
  const since = new Date(now.getTime() - hours * 60 * 60 * 1000)

  const rows = await prisma.spotPriceCache.findMany({
    where: {
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
  })

  const byMetal = new Map<string, SparkPoint[]>()

  for (const r of rows) {
    const arr = byMetal.get(r.metal) ?? []
    arr.push({
      t: r.createdAt.getTime(),
      p: Number(r.price),
    })
    byMetal.set(r.metal, arr)
  }

  const prices: PriceWithSparkline[] = Array.from(byMetal.entries())
    .map(([metal, points]) => {
      if (points.length === 0) return null

      const first = points[0]
      const last = points[points.length - 1]

      const changePct =
        first && last && first.p !== 0
          ? ((last.p - first.p) / first.p) * 100
          : null

      return {
        metal,
        price: last.p,
        changePct,
        spark: points,
      }
    })
    .filter(Boolean) as PriceWithSparkline[]

  prices.sort((a, b) => a.metal.localeCompare(b.metal))

  return (
    <main className="p-6 space-y-6">
      <PriceHeader prices={prices} range={range} />
    </main>
  )
}
