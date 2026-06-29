import { prisma } from "@/lib/prisma";

export type Metal = "gold" | "silver" | "platinum" | "palladium";

export type MetalRangeStats = {
  high30: number;
  low30: number;
  /** Earliest price recorded within the last 30 days — same "earliest in window"
   *  baseline the /api/charts/prices?range=30d endpoint uses, so this number
   *  agrees with the chart's own 30D change box. */
  oldest: number | null;
  /** Earliest price recorded within the last 7 days — mirrors range=7d. */
  price7dAgo: number | null;
};

/**
 * Time-windowed 7D/30D/high/low stats for a metal.
 *
 * Previously each /xxx-price page computed these by taking the 30 most
 * recent DB rows and indexing by position (row 30 back = "30 days ago",
 * row 7 back = "7 days ago"). That assumes exactly one price row per
 * calendar day with zero gaps — any missed cron run or extra backfilled
 * row shifts every index, so the page's 7D/30D % silently drifted from
 * the chart's 7D/30D %, which is computed by genuine time cutoffs
 * (now - 7d / now - 30d) in /api/charts/prices. This uses the same
 * time-cutoff approach so both numbers agree.
 */
export async function getMetalRangeStats(metal: Metal): Promise<MetalRangeStats | null> {
  try {
    const rows = await prisma.price.findMany({
      where: {
        metal,
        timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: "asc" },
      select: { price: true, timestamp: true },
    });

    if (rows.length === 0) return null;

    const prices = rows.map((r) => r.price);
    const high30 = Math.max(...prices);
    const low30  = Math.min(...prices);

    // Earliest row inside the 30-day window — matches range=30d's first bucket.
    const oldest = rows[0].price;

    // Earliest row inside the 7-day window — matches range=7d's first bucket.
    const sevenDayCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const price7dAgo = rows.find((r) => r.timestamp.getTime() >= sevenDayCutoff)?.price ?? null;

    return { high30, low30, oldest, price7dAgo };
  } catch {
    return null;
  }
}
