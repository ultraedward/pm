import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const since = new Date(Date.now() - 60 * 60 * 1000)

  const points = await prisma.price.findMany({
    where: {
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return NextResponse.json(points)
}
