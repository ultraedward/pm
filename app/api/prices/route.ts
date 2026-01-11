import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const rows = await prisma.spotPriceCache.findMany({
      orderBy: { createdAt: "asc" },
      take: 5000,
    })

    const prices: Record<string, { t: number; price: number }[]> = {}

    for (const r of rows ?? []) {
      if (!r?.metal || !r?.createdAt || r?.price == null) continue

      if (!prices[r.metal]) prices[r.metal] = []

      prices[r.metal].push({
        t: r.createdAt.getTime(),
        price: Number(r.price),
      })
    }

    return NextResponse.json({ prices })
  } catch (err) {
    console.error("PRICES API FAILED", err)

    // 🔑 ABSOLUTELY NEVER 500
    return NextResponse.json(
      { prices: {} },
      { status: 200 }
    )
  }
}
