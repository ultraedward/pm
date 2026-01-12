import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

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

    return NextResponse.json(
      { prices },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (err) {
    console.error("prices/current failed", err)

    return NextResponse.json(
      {
        prices: {
          gold: [],
          silver: [],
          platinum: [],
          palladium: [],
        },
        error: "prices api failed",
      },
      {
        status: 200, // DO NOT 500 — dashboard must render
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
}
