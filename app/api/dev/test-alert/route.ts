import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/dev/test-alert",
    method: "GET",
    message: "Dev test alert route is reachable",
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    route: "/api/dev/test-alert",
    method: "POST",
    message: "Dev test alert POST received",
    timestamp: new Date().toISOString(),
  });
}
