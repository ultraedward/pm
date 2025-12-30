// app/api/history/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "History API disabled (PriceHistory model not present in Prisma schema)",
    items: []
  })
}
