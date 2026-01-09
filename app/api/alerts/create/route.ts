// app/api/alerts/create/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function POST(req: Request) {
  const gate = await requirePro()
  if (gate instanceof NextResponse) return gate

  const body = await req.json()

  const { metal, direction, target } = body

  if (!metal || !direction || typeof target !== "number") {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    )
  }

  const alert = await prisma.alert.create({
    data: {
      userId: gate.userId,
      metal,
      direction,
      target,
    },
  })

  return NextResponse.json({
    ok: true,
    alert,
  })
}
