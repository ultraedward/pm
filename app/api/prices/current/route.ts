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

    return new NextResponse(
      JSON.stringify({ prices }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    )
  } catch (err) {
    console.error("PRICES CURRENT ERROR", err)
    return new NextResponse(
      JSON.stringify({ ok: false }),
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
