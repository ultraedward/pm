// app/api/cron/move-prices/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// LIVE PRICE CRON + HEALTH LOGGING

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
const MIN_CHANGE_PCT = 0.02;
const MAX_ABSOLUTE_CHANGE_PCT = 20;

type MetalsApiLatestResponse = {
  success: boolean;
  rates?: {
    USD?: number;
    XAU?: number;
    XAG?: number;
    XPT?: number;
    XPD?: number;
  };
};

async function fetchLatestPrices(): Promise<Record<string, number>> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) throw new Error("METALS_API_KEY missing");

  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${apiKey}&symbols=USD,XAU,XAG,XPT,XPD`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error(`Metals API ${res.status}`);

  const json = (await res.json()) as MetalsApiLatestResponse;
  if (!json.success || !json.rates?.USD) {
    throw new Error("Invalid Metals API response");
  }

  const usd = json.rates.USD;

  return {
    gold: usd / json.rates.XAU!,
    silver: usd / json.rates.XAG!,
    platinum: usd / json.rates.XPT!,
    palladium: usd / json.rates.XPD!,
  };
}

export async function GET(req: Request) {
  const name = "move-prices";

  try {
    if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
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

    let inserted = 0;

    for (const metal of METALS) {
      const newPrice = prices[metal];
      const last = latestMap[metal];

      if (last) {
        const pct = Math.abs((newPrice - last) / last) * 100;
        if (pct < MIN_CHANGE_PCT || pct > MAX_ABSOLUTE_CHANGE_PCT) continue;
      }

      await prisma.spotPriceCache.create({
        data: { metal, price: newPrice },
      });

      inserted++;
    }

    await prisma.cronRun.create({
      data: {
        name,
        status: "success",
        message: `Inserted ${inserted} rows`,
      },
    });

    return NextResponse.json({ ok: true, inserted });
  } catch (err: any) {
    await prisma.cronRun.create({
      data: {
        name,
        status: "error",
        message: err.message,
      },
    });

    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
