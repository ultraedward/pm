/**
 * One-time backfill route — populates 30-day price history from the CF Worker.
 * DELETE this file after running once.
 *
 * Trigger: GET https://www.lode.rocks/api/backfill
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WORKER_URL = process.env.PRICE_WORKER_URL ?? "https://lode-prices.ultra-edward.workers.dev";

export async function GET() {
  try {
    const res = await fetch(`${WORKER_URL}/history`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Worker HTTP ${res.status}` }, { status: 500 });
    }

    const json = (await res.json()) as {
      ok: boolean;
      history: Record<string, { timestamp: string; price: number }[]>;
    };

    if (!json.ok) {
      return NextResponse.json({ ok: false, error: "Worker returned ok:false" }, { status: 500 });
    }

    let totalUpserted = 0;
    const summary: Record<string, number> = {};

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
      summary[metal] = count;
    }

    return NextResponse.json({ ok: true, totalUpserted, summary });
  } catch (err) {
    console.error("Backfill error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
