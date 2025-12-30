// app/api/daily-summary/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Daily summary disabled (Metal model not present in Prisma schema)",
    timestamp: new Date().toISOString()
  })
}
