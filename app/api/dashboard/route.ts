import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
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

    /* ---------------- PRICES ---------------- */
    let prices: any[] = []
    try {
      prices = await prisma.spotPriceCache.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "asc" },
      })
    } catch (e) {
      console.error("PRICE QUERY FAILED", e)
    }

    const groupedPrices: Record<string, { t: number; price: number }[]> = {}

    for (const p of prices ?? []) {
      if (!p?.metal || !p?.createdAt || p?.price == null) continue

      if (!groupedPrices[p.metal]) groupedPrices[p.metal] = []
      groupedPrices[p.metal].push({
        t: p.createdAt.getTime(),
        price: Number(p.price),
      })
    }

    /* ---------------- ALERT TRIGGERS ---------------- */
    let triggers: any[] = []
    try {
      triggers = await prisma.alertTrigger.findMany({
        where: { triggeredAt: { gte: since } },
        include: {
          alert: { select: { metal: true } },
        },
        orderBy: { triggeredAt: "asc" },
      })
    } catch (e) {
      console.error("TRIGGER QUERY FAILED", e)
    }

    const alertTriggers = (triggers ?? [])
      .filter(t => t?.alert?.metal && t?.triggeredAt && t?.price != null)
      .map(t => ({
        t: t.triggeredAt.getTime(),
        price: Number(t.price),
        metal: t.alert.metal,
      }))

    /* ---------------- ALWAYS RETURN 200 ---------------- */
    return NextResponse.json({
      prices: groupedPrices,
      alertTriggers,
    })
  } catch (err) {
    console.error("DASHBOARD HARD FAIL", err)

    // 🔑 NEVER 500
    return NextResponse.json({
      prices: {},
      alertTriggers: [],
    })
  }
}
