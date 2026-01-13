import { NextResponse } from "next/server";

/**
 * Alerts are not implemented yet.
 * This endpoint intentionally returns an empty array.
 */
export async function GET() {
  return NextResponse.json([]);
}
