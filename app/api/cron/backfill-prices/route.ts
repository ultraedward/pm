// app/api/cron/backfill-prices/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * Backfill prices to smooth hourly → 5-minute intervals.
 * Safely converts Prisma Decimal → number before math.
 */
export async function POST() {
  try {
    const metals = ["gold", "silver", "platinum", "palladium"] as const
    const STEP_MS = 5 * 60 * 1000 // 5 minutes

    let inserted = 0

    for (const metal of metals) {
      const rows = await prisma.spotPriceCache.findMany({
        where: { metal },
        orderBy: { timestamp: "asc" },
      })

      if (rows.length < 2) continue

      for (let i = 0; i < rows.length - 1; i++) {
        const a = rows[i]
        const b = rows[i + 1]

        const start = a.timestamp.getTime()
        const end = b.timestamp.getTime()
        const gap = end - start

        if (gap <= STEP_MS) continue

        const steps = Math.floor(gap / STEP_MS)
        const priceA = Number(a.price)
        const priceB = Number(b.price)

        for (let s = 1; s < steps; s++) {
          const t = start + s * STEP_MS
          const ratio = s / steps
          const price = priceA + (priceB - priceA) * ratio

          await prisma.spotPriceCache.create({
            data: {
              metal,
              price,
              timestamp: new Date(t),
              source: "backfill",
            },
          })

          inserted++
        }
      }
    }

    return NextResponse.json({
      ok: true,
      inserted,
    })
  } catch (err: any) {
    console.error("BACKFILL FAILED", err)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
