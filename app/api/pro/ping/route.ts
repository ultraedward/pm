// app/api/pro/ping/route.ts
import { NextResponse } from "next/server"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const result = await requirePro()
  if (result instanceof NextResponse) return result

  return NextResponse.json({
    ok: true,
    plan: "PRO",
    time: new Date().toISOString(),
  })
}
