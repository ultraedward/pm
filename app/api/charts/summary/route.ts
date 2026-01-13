import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal") ?? "gold";
  const range = searchParams.get("range") ?? "24h";

  // TEMP: mock-safe math (works now, swap to DB later)
  const now = Date.now();
  const ranges: Record<string, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  const since = now - (ranges[range] ?? ranges["24h"]);

  // Mock prices (replace with real query later)
  const latest = metal === "gold" ? 2051.4 : metal === "silver" ? 24.3 : 980.2;
  const baseline = latest * (1 - 0.0082); // ~+0.82%

  const pct = ((latest - baseline) / baseline) * 100;

  return NextResponse.json({
    metal,
    latest,
    pct,
    since,
  });
}
