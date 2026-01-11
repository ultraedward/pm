import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await prisma.spotPriceCache.findMany({
      orderBy: { createdAt: "asc" },
      take: 500,
    })

    const prices: Record<string, { t: number; price: number }[]> = {}

    for (const r of rows) {
      if (!prices[r.metal]) prices[r.metal] = []
      prices[r.metal].push({
        t: r.createdAt.getTime(),
        price: Number(r.price),
      })
    }

    return NextResponse.json({ prices })
  } catch (e) {
    console.error("PRICES API ERROR", e)
    return NextResponse.json(
      { ok: false, error: "prices failed" },
      { status: 500 }
    )
  }
}
