// app/api/export/prices/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const session = await requirePro()
  if (session instanceof NextResponse) return session

  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
  })

  const header = "metal,price,createdAt\n"
  const rows = prices
    .map(
      (p) =>
        `${p.metal},${p.price},${p.createdAt.toISOString()}`
    )
    .join("\n")

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="prices.csv"',
    },
  })
}
