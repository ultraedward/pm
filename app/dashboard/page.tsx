// app/dashboard/page.tsx
// FULL SHEET — REPLACE ENTIRE FILE (FIXES IMPORT PATH)

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PriceHeader from "./PriceHeader"
import ManageSubscriptionButton from "./ManageSubscriptionButton"
import { unstable_cache } from "next/cache"

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

const RANGE_TO_HOURS: Record<RangeKey, number> = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
}

const MAX_POINTS = 500

async function getDashboardData(range: RangeKey) {
  const since = new Date(
    Date.now() - RANGE_TO_HOURS[range] * 60 * 60 * 1000
  )

  const [pricesRaw, alertsRaw] = await Promise.all([
    prisma.spotPriceCache.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: { metal: true, price: true, createdAt: true },
      take: MAX_POINTS * 5,
    }),
    prisma.alert.findMany({
      select: { metal: true, target: true },
    }),
  ])

  const byMetal = new Map<string, { t: number; p: number }[]>()
  pricesRaw.forEach((r) => {
    const arr = byMetal.get(r.metal) ?? []
    if (arr.length < MAX_POINTS) {
      arr.push({ t: r.createdAt.getTime(), p: Number(r.price) })
      byMetal.set(r.metal, arr)
    }
  })

  const alertsByMetal = new Map<string, number[]>()
  alertsRaw.forEach((a) => {
    const arr = alertsByMetal.get(a.metal) ?? []
    arr.push(Number(a.target))
    alertsByMetal.set(a.metal, arr)
  })

  return Array.from(byMetal.entries()).map(([metal, points]) => {
    const base = points[0].p
    const spark = points.map((pt) => ({
      t: pt.t,
      v: ((pt.p - base) / base) * 100,
    }))

    const last = points[points.length - 1]

    return {
      metal,
      price: last.p,
      changePct: ((last.p - base) / base) * 100,
      spark,
      alerts:
        alertsByMetal.get(metal)?.map((p) => ({
          v: ((p - base) / base) * 100,
        })) ?? [],
    }
  })
}

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
  const session = await getServerSession(authOptions)
  const range: RangeKey = searchParams.range ?? "24h"
  const prices = await getCachedDashboardData(range)

  const user =
    session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { isPro: true },
        })
      : null

  return (
    <main className="p-6 space-y-6">
      {user?.isPro && <ManageSubscriptionButton />}
      <PriceHeader prices={prices} range={range} />
    </main>
  )
}
