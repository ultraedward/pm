import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await prisma.spotPriceCache.findMany({
      orderBy: { createdAt: "asc" },
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
  } catch (e) {
    console.error(e)
    return new NextResponse(
      JSON.stringify({ error: "Failed to load prices" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
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
