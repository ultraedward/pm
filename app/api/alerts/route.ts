import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Alerts not backed by DB yet
  return NextResponse.json([]);
}