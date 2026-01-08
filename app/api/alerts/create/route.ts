import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // Auth guard
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // PRO guard
  if (!session.user.isPro) {
    return NextResponse.json(
      { error: "PRO plan required" },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { metal, target, direction } = body

  if (!metal || !target || !direction) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
      target,
      direction,
    },
  })

  // 🔴 THIS was missing before
  return NextResponse.json(alert)
}
