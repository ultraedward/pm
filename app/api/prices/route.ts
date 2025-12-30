// app/api/prices/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const metals = await prisma.metal.findMany({
    orderBy: { name: "asc" }
  })

  return NextResponse.json(metals)
}
