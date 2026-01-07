import { prisma } from "@/lib/prisma"
import PriceHeader from "./PriceHeader"

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

export default async function DashboardPage() {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const rows = await prisma.spotPriceCache.findMany({
    where: {
      createdAt: { gte: twentyFourHoursAgo },
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

  const prices: PriceWithSparkline[] = Array.from(byMetal.entries()).map(
    ([metal, points]) => {
      const first = points[0]
      const last = points[points.length - 1]

      const change24h =
        first && last && first.p !== 0
          ? ((last.p - first.p) / first.p) * 100
          : null

      return {
        metal,
        price: last.p,
        change24h,
        spark: points,
      }
    }
  )

  prices.sort((a, b) => a.metal.localeCompare(b.metal))

  return (
    <main className="p-6 space-y-6">
      <PriceHeader prices={prices} />
    </main>
  )
}
