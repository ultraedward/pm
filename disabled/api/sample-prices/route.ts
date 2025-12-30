// app/api/sample-prices/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Sample prices API disabled (Price model not present in Prisma schema)",
    data: []
  })
}
