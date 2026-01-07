import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RangeKey = "24h" | "7d" | "30d"

const RANGE_TO_HOURS: Record<RangeKey, number> = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const range = (searchParams.get("range") as RangeKey) ?? "24h"

  const hours = RANGE_TO_HOURS[range]
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  const [pricesRaw, alertsRaw] = await Promise.all([
    prisma.spotPriceCache.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: {
        metal: true,
        price: true,
        createdAt: true,
      },
    }),
    prisma.alert.findMany({
      select: {
        metal: true,
        target: true,
      },
    }),
  ])

  const alertsByMetal = new Map<string, number[]>()
  alertsRaw.forEach((a) => {
    const arr = alertsByMetal.get(a.metal) ?? []
    arr.push(Number(a.target))
    alertsByMetal.set(a.metal, arr)
  })

  const byMetal = new Map<string, { t: Date; p: number }[]>()
  pricesRaw.forEach((r) => {
    const arr = byMetal.get(r.metal) ?? []
    arr.push({ t: r.createdAt, p: Number(r.price) })
    byMetal.set(r.metal, arr)
  })

  const rows: string[] = []
  rows.push("timestamp,metal,price,percent_change,alert_hit")

  for (const [metal, points] of byMetal.entries()) {
    if (points.length < 1) continue

    const base = points[0].p
    const alerts = alertsByMetal.get(metal) ?? []

    for (let i = 0; i < points.length; i++) {
      const { t, p } = points[i]
      const pct = ((p - base) / base) * 100

      let alertHit = false
      if (i > 0) {
        const prev = points[i - 1].p
        alerts.forEach((a) => {
          if (
            (prev < a && p >= a) ||
            (prev > a && p <= a)
          ) {
            alertHit = true
          }
        })
      }

      rows.push(
        [
          t.toISOString(),
          metal,
          p.toFixed(2),
          pct.toFixed(4),
          alertHit ? "true" : "false",
        ].join(",")
      )
    }
  }

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="prices_${range}.csv"`,
    },
  })
}
