// app/api/dashboard/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Dashboard data disabled (Metal model not present in Prisma schema)",
    timestamp: new Date().toISOString()
  })
}
