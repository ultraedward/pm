import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const gate = await requirePro()
  if ("error" in gate) return gate.error

  const prices = await prisma.pricePoint.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(prices)
}
