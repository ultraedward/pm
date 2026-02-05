import { NextRequest, NextResponse } from "next/server";

/**
 * Charts API
 * Price history is NOT stored in Prisma.
 * This endpoint is a thin wrapper around your price engine / external source.
 */

export const dynamic = "force-dynamic";

type Metal = "gold" | "silver" | "platinum" | "palladium";

function parseRange(range: string | null): number {
  switch (range) {
    case "1d":
      return 24;
    case "7d":
      return 24 * 7;
    case "30d":
      return 24 * 30;
    case "90d":
      return 24 * 90;
    default:
      return 24 * 7;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const metal = (searchParams.get("metal") || "gold") as Metal;
  const range = searchParams.get("range");

  const hours = parseRange(range);

  /**
   * TODO:
   * Replace this with:
   * - external price service
   * - cached price engine
   * - cron-fed in-memory store
   *
   * This placeholder keeps builds green.
   */
  const now = Date.now();

  const data = Array.from({ length: hours }, (_, i) => ({
    t: now - (hours - i) * 60 * 60 * 1000,
    price: null,
    metal,
  }));

  return NextResponse.json({
    metal,
    range: range ?? "7d",
    points: data,
  });
}