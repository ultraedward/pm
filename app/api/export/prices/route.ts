// app/api/export/prices/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Price export disabled (Price model not present in Prisma schema)",
    exported: 0
  })
}
