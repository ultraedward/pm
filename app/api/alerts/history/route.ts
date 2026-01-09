import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export const runtime = "nodejs"

export async function GET() {
  const session = await requirePro()
  if (session instanceof NextResponse) return session

  const userId = session.user.id

  const history = await prisma.alertTrigger.findMany({
    where: {
      alert: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    include: {
      alert: {
        select: {
          metal: true,
          direction: true,
          target: true,
        },
      },
    },
  })

  return NextResponse.json({
    ok: true,
    count: history.length,
    history: history.map(t => ({
      id: t.id,
      metal: t.alert.metal,
      direction: t.alert.direction,
      target: t.alert.target,
      triggeredPrice: t.price,
      triggeredAt: t.createdAt,
    })),
  })
}
