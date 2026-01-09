// app/api/alerts/create/route.ts
import { NextResponse } from "next/server"
import { requirePro } from "@/lib/requirePro"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await requirePro()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const { metal, direction, target } = body

  if (!metal || !direction || typeof target !== "number") {
    return NextResponse.json(
      { error: "metal, direction, and target are required" },
      { status: 400 }
    )
  }

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
