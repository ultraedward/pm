import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Mock prices for now (replace later with real feed or DB)
  return NextResponse.json({
    gold: [],
    silver: [],
    platinum: [],
    palladium: []
  });
}