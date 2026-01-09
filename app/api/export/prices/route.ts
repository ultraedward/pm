import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const session = await requirePro()
  if (session instanceof NextResponse) return session

  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(prices)
}
