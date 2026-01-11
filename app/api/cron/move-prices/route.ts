// app/api/cron/move-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// LIVE PRICE CRON (METALS-API) — SECURED

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Metals we track
 */
const METALS = ["gold", "silver", "platinum", "palladium"] as const;

/**
 * Minimum % change required to store a new row
 * Prevents noisy duplicates
 */
const MIN_CHANGE_PCT = 0.02; // 0.02%

type MetalsApiLatestResponse = {
  success: boolean;
  rates?: {
    XAU?: number;
    XAG?: number;
    XPT?: number;
    XPD?: number;
  };
};

/**
 * Fetch live prices from Metals-API
 */
async function fetchLatestPrices(): Promise<Record<string, number>> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) throw new Error("METALS_API_KEY is missing");

  const url =
    "https://metals-api.com/api/latest" +
    `?access_key=${apiKey}` +
    "&base=USD&symbols=XAU,XAG,XPT,XPD";

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Metals API error: ${res.status}`);
  }

  const json = (await res.json()) as MetalsApiLatestResponse;

  if (!json.success || !json.rates) {
    throw new Error("Invalid Metals API response");
  }

  return {
    gold: json.rates.XAU ? 1 / json.rates.XAU : NaN,
    silver: json.rates.XAG ? 1 / json.rates.XAG : NaN,
    platinum: json.rates.XPT ? 1 / json.rates.XPT : NaN,
    palladium: json.rates.XPD ? 1 / json.rates.XPD : NaN,
  };
}

export async function GET(req: Request) {
  try {
    /**
     * 🔐 SECURITY CHECK
     */
    if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prices = await fetchLatestPrices();

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
      if (!newPrice || Number.isNaN(newPrice)) continue;

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

    if (writes.length) {
      await prisma.$transaction(writes);
    }

    return NextResponse.json({
      ok: true,
      inserted: writes.length,
      skipped,
      minChangePct: MIN_CHANGE_PCT,
      provider: "Metals-API",
    });
  } catch (err: any) {
    console.error("MOVE PRICES CRON FAILED", err);

    return NextResponse.json(
      { ok: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
