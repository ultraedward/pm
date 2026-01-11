// app/api/cron/backfill-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
const HOURS_BACK = 72;
const BUCKET_MINUTES = 5;
const MAX_INSERTS = 3000;

async function fetchHourlyHistory() {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) throw new Error("METALS_API_KEY is missing");

  const end = Math.floor(Date.now() / 1000);
  const start = end - HOURS_BACK * 3600;

  const url =
    "https://metals-api.com/api/timeseries" +
    `?access_key=${apiKey}` +
    `&base=USD&symbols=XAU,XAG,XPT,XPD` +
    `&start_date=${new Date(start * 1000).toISOString().slice(0, 10)}` +
    `&end_date=${new Date(end * 1000).toISOString().slice(0, 10)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Metals API error: ${res.status}`);

  const json = await res.json();
  if (!json.success || !json.rates) {
    throw new Error("Invalid Metals API response");
  }

  const map: Record<string, string> = {
    XAU: "gold",
    XAG: "silver",
    XPT: "platinum",
    XPD: "palladium",
  };

  const out: Record<string, { t: number; price: number }[]> = {
    gold: [],
    silver: [],
    platinum: [],
    palladium: [],
  };

  for (const [date, rates] of Object.entries(json.rates)) {
    const ts = new Date(date).getTime();
    for (const sym of Object.keys(map)) {
      if (!rates[sym]) continue;
      out[map[sym]].push({
        t: ts,
        price: 1 / rates[sym],
      });
    }
  }

  return out;
}

function expand(points: { t: number; price: number }[]) {
  const rows = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const steps = 60 / BUCKET_MINUTES;

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
            data: { metal, price: r.price, createdAt: r.createdAt },
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
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
