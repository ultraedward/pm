import { NextResponse } from "next/server";

type Metal = "gold" | "silver" | "platinum" | "palladium";

const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

function mockPrices(): Record<Metal, number> {
  return {
    gold: 2050,
    silver: 25.4,
    platinum: 920,
    palladium: 980,
  };
}

export async function GET() {
  // Toggle LIVE later by setting PRICE_MODE=LIVE
  const LIVE = process.env.PRICE_MODE === "LIVE";

  let prices: Record<Metal, number>;

  if (!LIVE) {
    prices = mockPrices();
  } else {
    // Placeholder for real provider (Metals-API, etc.)
    // Keep schema-safe: no DB writes yet
    prices = mockPrices();
  }

  return NextResponse.json({
    ok: true,
    mode: LIVE ? "live" : "mock",
    prices,
    ingestedAt: new Date().toISOString(),
  });
}
