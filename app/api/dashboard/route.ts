// app/api/dashboard/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") ?? "24h"

  const now = Date.now()
  const rangeMs =
    range === "7d"
      ? 7 * 24 * 60 * 60 * 1000
      : range === "30d"
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000

  const since = new Date(now - rangeMs)

  const prices = await prisma.spotPriceCache.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  })

  const triggers = await prisma.alertTrigger.findMany({
    where: { triggeredAt: { gte: since } },
    orderBy: { triggeredAt: "asc" },
  })

  const groupedPrices: Record<string, { t: number; price: number }[]> = {}

  for (const p of prices) {
    if (!groupedPrices[p.metal]) groupedPrices[p.metal] = []
    groupedPrices[p.metal].push({
      t: p.createdAt.getTime(),
      price: Number(p.price),
    })
  }

  const alertTriggers = triggers.map(t => ({
    t: t.triggeredAt.getTime(),
    price: Number(t.price),
    metal: t.metal,
  }))

  return NextResponse.json({
    prices: groupedPrices,
    alertTriggers,
  })
}
