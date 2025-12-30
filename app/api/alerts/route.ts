// app/api/alerts/route.ts

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "disabled",
    message: "Alerts API temporarily disabled (no Alert model in schema)"
  })
}

export async function POST() {
  return NextResponse.json(
    {
      status: "disabled",
      message: "Alert creation disabled until schema is added"
    },
    { status: 501 }
  )
}
