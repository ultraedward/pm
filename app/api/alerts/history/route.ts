import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const gate = await requirePro()
  if ("error" in gate) return gate.error

  const alerts = await prisma.alert.findMany({
    where: { userId: gate.userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(alerts)
}
