// app/api/cron/move-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Metals we track
 * Keep lowercase to match DB + chart expectations
 */
const METALS = ["gold", "silver", "platinum", "palladium"] as const;

/**
 * Fetch live prices from Metals-API
 * https://metals-api.com
 */
async function fetchPrices(): Promise<Record<string, number>> {
  const apiKey = process.env.METALS_API_KEY;

  if (!apiKey) {
    throw new Error("METALS_API_KEY is missing");
  }

  const url = `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG,XPT,XPD`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Metals API error: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success || !json.rates) {
    throw new Error("Invalid Metals API response");
  }

  return {
    gold: 1 / json.rates.XAU,
    silver: 1 / json.rates.XAG,
    platinum: 1 / json.rates.XPT,
    palladium: 1 / json.rates.XPD,
  };
}

export async function GET() {
  try {
    const prices = await fetchPrices();

    const writes = METALS.map((metal) =>
      prisma.spotPriceCache.create({
        data: {
          metal,
          price: prices[metal],
        },
      })
    );

    await prisma.$transaction(writes);

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      prices,
    });
  } catch (err: any) {
    console.error("PRICE CRON FAILED", err);

    return NextResponse.json(
      {
        ok: false,
        error: err.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
