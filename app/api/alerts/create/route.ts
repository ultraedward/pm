import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function POST(req: Request) {
  // 1️⃣ Enforce PRO + get session
  const session = await requirePro()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const { metal, direction, target } = body

  if (!metal || !direction || !target) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  // 2️⃣ Create alert (schema-aligned)
  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
      direction,
      target,
    },
  })

  return NextResponse.json({ ok: true, alert })
}
