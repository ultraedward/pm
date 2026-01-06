import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET — allows browser testing
 * Visit: /api/dev/test-alert
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "GET",
    message: "dev test alert route reachable",
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST — mirrors how cron / internal calls will work
 */
export async function POST() {
  return NextResponse.json({
    ok: true,
    method: "POST",
    message: "dev test alert route reachable",
    timestamp: new Date().toISOString(),
  });
}
