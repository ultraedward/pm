import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (!session.user.isPro) {
    return NextResponse.json(
      { error: "PRO plan required" },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { metal, direction, target } = body

  if (
    typeof metal !== "string" ||
    typeof direction !== "string" ||
    typeof target !== "number"
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }

  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
      direction,
      target, // ✅ MATCHES PRISMA SCHEMA
    },
  })

  return NextResponse.json({ ok: true, alert })
}
