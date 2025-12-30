import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const metals = await prisma.metal.findMany()

  return NextResponse.json({
    status: "ok",
    count: metals.length
  })
}
