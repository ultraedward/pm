// app/api/alerts/history/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const gate = await requirePro()
  if (gate instanceof NextResponse) return gate

  // Only models that EXIST in your schema
  const alerts = await prisma.alert.findMany({
    where: {
      userId: gate.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      triggers: true, // AlertTrigger relation EXISTS
    },
  })

  return NextResponse.json({
    ok: true,
    alerts,
  })
}
