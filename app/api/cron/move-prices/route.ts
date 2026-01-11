// app/api/cron/move-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Metals we track
 */
const METALS = ["gold", "silver", "platinum", "palladium"] as const;

/**
 * Minimum % change required to store a new row
 * Prevents noisy duplicate prices
 */
const MIN_CHANGE_PCT = 0.02; // 0.02% = very tight, safe for charts

/**
 * Fetch live prices from Metals-API
 */
async function fetchPrices(): Promise<Record<string, number>> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) throw new Error("METALS_API_KEY is missing");

  const url =
    "https://metals-api.com/api/latest" +
    `?access_key=${apiKey}` +
    "&base=USD&symbols=XAU,XAG,XPT,XPD";

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Metals API error: ${res.status}`);

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

    const latest = await prisma.spotPriceCache.findMany({
      distinct: ["metal"],
      orderBy: { createdAt: "desc" },
      select: { metal: true, price: true },
    });

    const latestMap = Object.fromEntries(
      latest.map((p) => [p.metal, Number(p.price)])
    );

    const writes = [];
    const skipped: string[] = [];

    for (const metal of METALS) {
      const newPrice = prices[metal];
      const lastPrice = latestMap[metal];

      if (lastPrice) {
        const pctChange =
          Math.abs((newPrice - lastPrice) / lastPrice) * 100;

        if (pctChange < MIN_CHANGE_PCT) {
          skipped.push(metal);
          continue;
        }
      }

      writes.push(
        prisma.spotPriceCache.create({
          data: {
            metal,
            price: newPrice,
          },
        })
      );
    }

    if (writes.length > 0) {
      await prisma.$transaction(writes);
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      inserted: writes.length,
      skipped,
      prices,
      minChangePct: MIN_CHANGE_PCT,
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
