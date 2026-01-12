import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
  const LIVE = process.env.PRICE_MODE === "LIVE";

  // TODO: replace with real provider when ready
  const prices = mockPrices();

  const now = new Date();

  for (const metal of METALS) {
    await prisma.price.create({
      data: {
        metal,
        price: prices[metal],
        timestamp: now,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    mode: LIVE ? "live" : "mock",
    inserted: METALS.length,
    at: now.toISOString(),
  });
}
