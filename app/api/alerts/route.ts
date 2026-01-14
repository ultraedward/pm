import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 })
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      metal: true,
      direction: true,
      targetPrice: true,
      createdAt: true,
    },
  })

  return NextResponse.json(alerts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { metal, direction, targetPrice } = body

  const alert = await prisma.alert.create({
    data: {
      metal,
      direction,
      targetPrice,
      userId: session.user.id,
    },
  })

  return NextResponse.json(alert)
}
