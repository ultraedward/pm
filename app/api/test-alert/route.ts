import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "API routing is now working",
    timestamp: new Date().toISOString()
  });
}
