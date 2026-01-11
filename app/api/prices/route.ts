import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await prisma.spotPriceCache.findMany({
      select: {
        metal: true,
        price: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 500,
    })

    const prices: Record<string, { t: number; price: number }[]> = {
      gold: [],
      silver: [],
      platinum: [],
      palladium: [],
    }

    for (const r of rows) {
      const metal = r.metal?.toLowerCase?.()

      if (!metal || !prices[metal]) continue

      prices[metal].push({
        t: r.createdAt.getTime(),
        price: Number(r.price),
      })
    }

    return NextResponse.json({ prices })
  } catch (err) {
    console.error("🔥 /api/prices FAILED", err)

    return NextResponse.json(
      {
        error: "prices api failed",
        message:
          err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    )
  }
}
