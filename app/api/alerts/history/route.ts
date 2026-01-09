// app/api/alerts/history/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const gate = await requirePro()
  if (gate instanceof NextResponse) return gate

  const alerts = await prisma.alert.findMany({
    where: { userId: gate.userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ alerts })
}
