// app/api/cron/backfill-prices/route.ts
// FULL SHEET — COPY / PASTE

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Backfill prices to smooth hourly → 5-minute intervals.
 * Intended to be called by a cron job.
 */
export async function GET(req: Request) {
  try {
    // Optional auth via header (kept dynamic-safe)
    const auth = req.headers.get("authorization");
    if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const metals = ["gold", "silver", "platinum", "palladium"] as const;

    const inserted: Record<string, number> = {};
    const skipped: string[] = [];

    for (const metal of metals) {
      // Get last 24h of hourly-ish points
      const rows = await prisma.spotPriceCache.findMany({
        where: { metal },
        orderBy: { createdAt: "asc" },
        take: 300,
      });

      if (rows.length < 2) {
        skipped.push(metal);
        continue;
      }

      let count = 0;

      for (let i = 0; i < rows.length - 1; i++) {
        const a = rows[i];
        const b = rows[i + 1];

        const start = new Date(a.createdAt).getTime();
        const end = new Date(b.createdAt).getTime();
        const step = 5 * 60 * 1000; // 5 minutes

        const steps = Math.floor((end - start) / step);
        if (steps <= 1) continue;

        for (let s = 1; s < steps; s++) {
          const t = start + s * step;
          const ratio = s / steps;
          const price = a.price + (b.price - a.price) * ratio;

          await prisma.spotPriceCache.create({
            data: {
              metal,
              price,
              createdAt: new Date(t),
            },
          });

          count++;
        }
      }

      inserted[metal] = count;
    }

    return NextResponse.json({
      ok: true,
      inserted,
      skipped,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Backfill failed" },
      { status: 500 }
    );
  }
}
