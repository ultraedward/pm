// app/api/pro/ping/route.ts
import { NextResponse } from "next/server"
import { requirePro } from "@/lib/requirePro"

export async function GET() {
  const session = await requirePro()

  // If requirePro already returned a response (403), forward it
  if (session instanceof NextResponse) {
    return session
  }

  return NextResponse.json({
    ok: true,
    plan: "PRO",
    userId: session.user.id,
  })
}
