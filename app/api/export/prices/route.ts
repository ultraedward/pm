// app/api/export/prices/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const gate = await requirePro()
  if (gate instanceof NextResponse) return gate

  // Uses EXISTING model: SpotPriceCache
  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({
    ok: true,
    prices,
  })
}
