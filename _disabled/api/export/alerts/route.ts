// app/api/export/alerts/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Alert export disabled (Alert model not present in Prisma schema)",
    exported: 0
  })
}
