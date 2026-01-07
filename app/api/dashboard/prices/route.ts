import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const rows = await prisma.spotPriceCache.findMany({
    orderBy: { metal: "asc" },
  })

  const prices = rows.map((row) => ({
    metal: row.metal,
    price: Number(row.price),
  }))

  return NextResponse.json(prices)
}
