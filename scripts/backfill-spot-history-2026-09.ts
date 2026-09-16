/**
 * One-time backfill: replaces gold/silver Price rows for Jul 22 – Sep 15, 2026
 * with true XAUUSD/XAGUSD spot closes.
 *
 * WHY: cloudflare-worker/prices-worker.js (fixed in commit f8b5e11) was
 * sourcing gold/silver from Yahoo Finance futures (GC=F/SI=F) instead of true
 * spot, running ~1% (varies day to day with contango) above real spot. The
 * cron job that populates this Price table (lib/priceEngine.ts) calls the
 * same worker, so every row here for gold/silver since that bug was
 * introduced (~May 3, 2026, see commit 1ba533e) carries the same bias. This
 * script corrects the most recent ~8 weeks so the 7D/30D change figures,
 * 30-day high/low, and price-history chart aren't skewed during the
 * transition — the live fix (deployed 2026-09-16) means everything from
 * today onward is already correct without a backfill.
 *
 * DATA SOURCE: Stooq's historical-data page (stooq.com/q/d/?s=xauusd /
 * xagusd), true spot (not futures), scraped 2026-09-16 — Stooq's CSV
 * download endpoint (q/d/l) currently returns "Access denied" (this repo
 * tried and abandoned Stooq for that exact reason back in March 2026, see
 * commit 9f4b03d — it seems to still be broken for programmatic bulk
 * download, though the HTML historical-data table itself still renders
 * fine). Cross-checked against Kitco and lode.rocks' own fixed worker on
 * 2026-09-16 — all three agreed within a few dollars.
 *
 * This only covers gold + silver. Platinum/palladium are untouched — they're
 * still on the Yahoo futures path going forward too (no free true-spot
 * source found for those), so there's nothing to "correct" them toward yet.
 *
 * Run once: npx tsx scripts/backfill-spot-history-2026-09.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [ISO date, true spot close] — sourced from Stooq (stooq.com/q/d/?s=xauusd)
const GOLD: [string, number][] = [
  ["2026-07-22", 4130.095],
  ["2026-07-23", 4049.525],
  ["2026-07-24", 4054.045],
  ["2026-07-27", 4076.715],
  ["2026-07-28", 4028.565],
  ["2026-07-29", 4066.355],
  ["2026-07-30", 4103.755],
  ["2026-07-31", 4050.845],
  ["2026-08-03", 4055.275],
  ["2026-08-04", 4077.415],
  ["2026-08-05", 4246.995],
  ["2026-08-06", 4240.825],
  ["2026-08-07", 4344.385],
  ["2026-08-10", 4390.365],
  ["2026-08-11", 4368.135],
  ["2026-08-12", 4408.595],
  ["2026-08-13", 4351.175],
  ["2026-08-14", 4376.265],
  ["2026-08-17", 4416.715],
  ["2026-08-18", 4334.305],
  ["2026-08-19", 4523.035],
  ["2026-08-20", 4519.375],
  ["2026-08-21", 4616.665],
  ["2026-08-24", 4651.675],
  ["2026-08-25", 4658.805],
  ["2026-08-26", 4594.695],
  ["2026-08-27", 4601.885],
  ["2026-08-28", 4458.49],
  ["2026-08-31", 4449.16],
  ["2026-09-01", 4328.24],
  ["2026-09-02", 4388.18],
  ["2026-09-03", 4473.22],
  ["2026-09-04", 4435.08],
  ["2026-09-07", 4406.25],
  ["2026-09-08", 4355.49],
  ["2026-09-09", 4401.83],
  ["2026-09-10", 4316.67],
  ["2026-09-11", 4348.89],
  ["2026-09-14", 4298.81],
  ["2026-09-15", 4294.17],
];

// [ISO date, true spot close] — sourced from Stooq (stooq.com/q/d/?s=xagusd)
const SILVER: [string, number][] = [
  ["2026-07-22", 59.715],
  ["2026-07-23", 57.658],
  ["2026-07-24", 58.203],
  ["2026-07-27", 58.403],
  ["2026-07-28", 57.114],
  ["2026-07-29", 57.629],
  ["2026-07-30", 58.991],
  ["2026-07-31", 57.928],
  ["2026-08-03", 58.191],
  ["2026-08-04", 59.529],
  ["2026-08-05", 62.054],
  ["2026-08-06", 61.534],
  ["2026-08-07", 63.627],
  ["2026-08-10", 65.745],
  ["2026-08-11", 64.681],
  ["2026-08-12", 65.325],
  ["2026-08-13", 64.478],
  ["2026-08-14", 64.721],
  ["2026-08-17", 65.79],
  ["2026-08-18", 63.333],
  ["2026-08-19", 67.003],
  ["2026-08-20", 68.097],
  ["2026-08-21", 69.396],
  ["2026-08-24", 68.97],
  ["2026-08-25", 68.669],
  ["2026-08-26", 68.127],
  ["2026-08-27", 69.272],
  ["2026-08-28", 66.454],
  ["2026-08-31", 66.56],
  ["2026-09-01", 64.08],
  ["2026-09-02", 65.329],
  ["2026-09-03", 66.983],
  ["2026-09-04", 66.222],
  ["2026-09-07", 66.173],
  ["2026-09-08", 65.753],
  ["2026-09-09", 67.288],
  ["2026-09-10", 63.577],
  ["2026-09-11", 64.375],
  ["2026-09-14", 63.238],
  ["2026-09-15", 63.682],
];

async function backfillMetal(metal: string, rows: [string, number][]) {
  let count = 0;
  for (const [date, price] of rows) {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    const timestamp = new Date(`${date}T21:00:00.000Z`); // ~NY close, UTC

    const deleted = await prisma.price.deleteMany({
      where: { metal, timestamp: { gte: dayStart, lte: dayEnd } },
    });

    await prisma.price.create({
      data: { metal, price, timestamp },
    });

    count++;
    console.log(
      `${metal} ${date}: removed ${deleted.count} futures-based row(s), inserted true spot ${price}`
    );
  }
  return count;
}

async function main() {
  console.log("Backfilling gold (true spot, Jul 22 – Sep 15 2026)...");
  const g = await backfillMetal("gold", GOLD);

  console.log("\nBackfilling silver (true spot, Jul 22 – Sep 15 2026)...");
  const s = await backfillMetal("silver", SILVER);

  console.log(`\nDone. gold: ${g} days corrected, silver: ${s} days corrected.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("ERROR:", err);
  await prisma.$disconnect();
  process.exit(1);
});
