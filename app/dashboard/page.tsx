// app/dashboard/page.tsx

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import PriceHeader from "./PriceHeader"
import ManageSubscriptionButton from "./ManageSubscriptionButton"
import { unstable_cache } from "next/cache"

type RangeKey = "24h" | "7d" | "30d"

const RANGE_TO_HOURS: Record<RangeKey, number> = {
  "24h": 24,
  "7d": 168,
  "30d": 720,
}

const MAX_POINTS = 500

async function getDashboardData(range: RangeKey) {
  const since = new Date(Date.now() - RANGE_TO_HOURS[range] * 3600 * 1000)

  const prices = await prisma.spotPriceCache.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  })

  return prices
}

const getCachedDashboardData = (range: RangeKey) =>
  unstable_cache(
    () => getDashboardData(range),
    ["dashboard", range],
    { revalidate: 60 }
  )()

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: RangeKey }
}) {
  const session = await auth()
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
