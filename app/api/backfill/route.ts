/**
 * One-time route: backfills 30-day history from CF Worker then purges stale prices.
 * DELETE this file after running once.
 * Trigger: GET https://www.lode.rocks/api/backfill
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WORKER_URL = process.env.PRICE_WORKER_URL ?? "https://lode-prices.ultra-edward.workers.dev";

const STALE_THRESHOLDS: Record<string, number> = {
  gold: 3000, silver: 50, platinum: 1200, palladium: 800,
};

export async function GET() {
  try {
    // 1. Fetch 30-day history from CF Worker
    const res = await fetch(`${WORKER_URL}/history`, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ ok: false, error: `Worker HTTP ${res.status}` }, { status: 500 });

    const json = (await res.json()) as {
      ok: boolean;
      history: Record<string, { timestamp: string; price: number }[]>;
    };
    if (!json.ok) return NextResponse.json({ ok: false, error: "Worker returned ok:false" }, { status: 500 });

    let totalUpserted = 0;
    const upsertSummary: Record<string, number> = {};

    for (const [metal, points] of Object.entries(json.history)) {
      let count = 0;
      for (const { timestamp: tsStr, price } of points) {
        const timestamp = new Date(tsStr);
        await prisma.price.upsert({
          where:  { metal_timestamp: { metal, timestamp } },
          update: { price },
          create: { metal, price, timestamp },
        });
        count++;
        totalUpserted++;
      }
      upsertSummary[metal] = count;
    }

    // 2. Purge any stale fallback prices
    let totalDeleted = 0;
    const deleteSummary: Record<string, number> = {};
    for (const [metal, threshold] of Object.entries(STALE_THRESHOLDS)) {
      const result = await prisma.price.deleteMany({ where: { metal, price: { lt: threshold } } });
      deleteSummary[metal] = result.count;
      totalDeleted += result.count;
    }

    const remaining = await prisma.price.groupBy({ by: ["metal"], _count: { id: true } });

    return NextResponse.json({ ok: true, totalUpserted, upsertSummary, totalDeleted, deleteSummary, remaining });
  } catch (err) {
    console.error("Backfill error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
