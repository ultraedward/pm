import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const latest = await prisma.spotPriceCache.findMany({
      distinct: ["metal"],
      orderBy: { createdAt: "desc" },
    })

    const prices: Record<string, number> = {}

    for (const r of latest) {
      prices[r.metal] = Number(r.price)
    }

    return NextResponse.json({ prices })
  } catch (e) {
    console.error("CURRENT PRICES ERROR", e)
    return NextResponse.json(
      { error: "current prices failed" },
      { status: 500 }
    )
  }
}
