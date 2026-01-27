// app/api/prices/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Prices API disabled (Metal model not present in Prisma schema)",
    data: []
  })
}
