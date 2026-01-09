import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPro: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // 🔒 FREE PLAN LIMIT (1 ALERT TOTAL)
  if (!user.isPro) {
    const count = await prisma.alert.count({
      where: { userId: session.user.id },
    })

    if (count >= 1) {
      return NextResponse.json(
        {
          error: "Free plan limit reached",
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }
  }

  const body = await req.json()
  const { metal, direction, targetPrice } = body

  if (!metal || !direction || typeof targetPrice !== "number") {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    )
  }

  // 1️⃣ Create the Alert (NO price here)
  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
    },
  })

  // 2️⃣ Create the Trigger (price lives here)
  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      direction,
      price: targetPrice,
    },
  })

  return NextResponse.json({ alertId: alert.id })
}
