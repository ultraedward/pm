import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/test-alert",
    method: "GET",
    message: "Test alert API route is live",
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    route: "/api/test-alert",
    method: "POST",
    message: "Test alert POST received",
    timestamp: new Date().toISOString(),
  });
}
