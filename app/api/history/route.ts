import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const history = await prisma.priceHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: 500
  })

  return NextResponse.json(history)
}
