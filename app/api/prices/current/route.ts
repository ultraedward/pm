import { NextResponse } from "next/server";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 5-minute in-memory cache for this API route — avoids redundant calls to the CF Worker / Yahoo Finance
const CACHE_TTL = 5 * 60 * 1000;
let cache: { data: Awaited<ReturnType<typeof fetchAllSpotPrices>>; ts: number } | null = null;

export async function GET() {
  try {
    const now = Date.now();

    if (cache && now - cache.ts < CACHE_TTL) {
      return NextResponse.json({ ok: true, ...cache.data, source: "cache" });
    }

    const prices = await fetchAllSpotPrices();

    if (prices.gold === null || prices.silver === null) {
      // Fall through to stale cache if we have one, even if expired
      if (cache) {
        return NextResponse.json({ ok: true, ...cache.data, source: "stale_cache" });
      }
      return NextResponse.json(
        { ok: false, gold: null, silver: null, platinum: null, palladium: null, error: "fetch_failed" },
        { status: 503 }
      );
    }

    cache = { data: prices, ts: now };

    return NextResponse.json({ ok: true, ...prices, source: "live" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Current prices API error:", message);

    if (cache) {
      return NextResponse.json({ ok: true, ...cache.data, source: "stale_cache" });
    }

    return NextResponse.json(
      { ok: false, gold: null, silver: null, platinum: null, palladium: null, error: message },
      { status: 503 }
    );
  }
}
