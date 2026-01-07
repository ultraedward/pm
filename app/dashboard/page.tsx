import { prisma } from "@/lib/prisma"
import PriceHeader from "./PriceHeader"
import { unstable_cache } from "next/cache"

type SparkPoint = {
  t: number
  v: number
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

const MAX_POINTS = 300

async function getDashboardData(range: RangeKey) {
  const hours = RANGE_TO_HOURS[range]
  const now = new Date()
  const since = new Date(now.getTime() - hours * 60 * 60 * 1000)

  const rows = await prisma.spotPriceCache.findMany({
    where: {
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: {
      metal: true,
      price: true,
      createdAt: true,
    },
    take: MAX_POINTS * 5,
  })

  const byMetal = new Map<string, { t: number; p: number }[]>()

  for (const r of rows) {
    const arr = byMetal.get(r.metal) ?? []
    if (arr.length < MAX_POINTS) {
      arr.push({
        t: r.createdAt.getTime(),
        p: Number(r.price),
      })
      byMetal.set(r.metal, arr)
    }
  }

  const prices: PriceWithSparkline[] = Array.from(byMetal.entries())
    .map(([metal, points]) => {
      if (points.length < 1) return null

      const base = points[0].p
      if (!base || base === 0) return null

      const spark = points.map((pt) => ({
        t: pt.t,
        v: ((pt.p - base) / base) * 100,
      }))

      const last = points[points.length - 1]
      const changePct = ((last.p - base) / base) * 100

      return {
        metal,
        price: last.p,
        changePct,
        spark,
      }
    })
    .filter(Boolean) as PriceWithSparkline[]

  prices.sort((a, b) => a.metal.localeCompare(b.metal))
  return prices
}

// 🔥 Cache per range for 60 seconds
const getCachedDashboardData = (range: RangeKey) =>
  unstable_cache(
    () => getDashboardData(range),
    ["dashboard-data", range],
    { revalidate: 60 }
  )()

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: RangeKey }
}) {
  const range: RangeKey = searchParams.range ?? "24h"
  const prices = await getCachedDashboardData(range)

  return (
    <main className="p-6 space-y-6">
      <PriceHeader prices={prices} range={range} />
    </main>
  )
}
