/**
 * One-time cleanup route — removes stale fallback prices from the DB.
 * These are prices saved when the price engine was returning hardcoded fallbacks.
 * DELETE this file after running once.
 *
 * Trigger: GET https://www.lode.rocks/api/backfill
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Thresholds below which a price is clearly a stale hardcoded fallback
// (gold ~$2042, silver ~$22, platinum ~$900, palladium ~$1000 were 2023-era defaults)
const STALE_THRESHOLDS: Record<string, number> = {
  gold:      3000,
  silver:    50,
  platinum:  1200,
  palladium: 800,
};

export async function GET() {
  try {
    let totalDeleted = 0;
    const summary: Record<string, number> = {};

    for (const [metal, threshold] of Object.entries(STALE_THRESHOLDS)) {
      const result = await prisma.price.deleteMany({
        where: { metal, price: { lt: threshold } },
      });
      summary[metal] = result.count;
      totalDeleted += result.count;
    }

    // Also report what's left
    const remaining = await prisma.price.groupBy({
      by: ["metal"],
      _count: { id: true },
    });

    return NextResponse.json({ ok: true, totalDeleted, summary, remaining });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
