// app/api/cron/backfill-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
const HOURS_BACK = 72;
const BUCKET_MINUTES = 5;
const MAX_INSERTS = 3000;

/**
 * Metals-API response typing
 */
type MetalsApiTimeseriesResponse = {
  success: boolean;
  rates: Record<
    string, // YYYY-MM-DD
    {
      XAU?: number;
      XAG?: number;
      XPT?: number;
      XPD?: number;
    }
  >;
};

/**
 * Fetch hourly historical prices from Metals-API
 */
async function fetchHourlyHistory(): Promise<
  Record<(typeof METALS)[number], { t: number; price: number }[]>
> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) throw new Error("METALS_API_KEY is missing");

  const end = Math.floor(Date.now() / 1000);
  const start = end - HOURS_BACK * 3600;

  const url =
    "https://metals-api.com/api/timeseries" +
    `?access_key=${apiKey}` +
    "&base=USD&symbols=XAU,XAG,XPT,XPD" +
    `&start_date=${new Date(start * 1000).toISOString().slice(0, 10)}` +
    `&end_date=${new Date(end * 1000).toISOString().slice(0, 10)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Metals API error: ${res.status}`);

  const json = (await res.json()) as MetalsApiTimeseriesResponse;

  if (!json.success || !json.rates) {
    throw new Error("Invalid Metals API response");
  }

  const symbolMap = {
    XAU: "gold",
    XAG: "silver",
    XPT: "platinum",
    XPD: "palladium",
  } as const;

  const out: Record<(typeof METALS)[number], { t: number; price: number }[]> = {
    gold: [],
    silver: [],
    platinum: [],
    palladium: [],
  };

  for (const [date, rates] of Object.entries(json.rates)) {
    const ts = new Date(date).getTime();

    if (rates.XAU)
      out.gold.push({ t: ts, price: 1 / rates.XAU });
    if (rates.XAG)
      out.silver.push({ t: ts, price: 1 / rates.XAG });
    if (rates.XPT)
      out.platinum.push({ t: ts, price: 1 / rates.XPT });
    if (rates.XPD)
      out.palladium.push({ t: ts, price: 1 / rates.XPD });
  }

  return out;
}

/**
 * Expand hourly points into smoothed 5-minute buckets
 */
function expand(
  points: { t: number; price: number }[]
): { createdAt: Date; price: number }[] {
  const rows: { createdAt: Date; price: number }[] = [];
  const steps = 60 / BUCKET_MINUTES;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];

    for (let s = 0; s < steps; s++) {
      const ratio = s / steps;
      rows.push({
        createdAt: new Date(a.t + s * BUCKET_MINUTES * 60_000),
        price: a.price + (b.price - a.price) * ratio,
      });
    }
  }

  return rows;
}

export async function GET() {
  try {
    const history = await fetchHourlyHistory();

    let inserted = 0;
    const writes = [];

    for (const metal of METALS) {
      const rows = expand(history[metal]);

      for (const r of rows) {
        if (inserted >= MAX_INSERTS) break;

        writes.push(
          prisma.spotPriceCache.create({
            data: {
              metal,
              price: r.price,
              createdAt: r.createdAt,
            },
          })
        );

        inserted++;
      }
    }

    if (writes.length) {
      await prisma.$transaction(writes);
    }

    return NextResponse.json({
      ok: true,
      inserted,
      hoursBack: HOURS_BACK,
      bucketMinutes: BUCKET_MINUTES,
    });
  } catch (err: any) {
    console.error("BACKFILL CRON FAILED", err);

    return NextResponse.json(
      { ok: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
