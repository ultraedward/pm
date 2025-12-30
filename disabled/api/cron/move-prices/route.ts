// app/api/cron/move-prices/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Price movement disabled (Metal model not present in Prisma schema)",
    timestamp: new Date().toISOString()
  })
}
