/**
 * Backfills 30-day daily price history using the Cloudflare Worker /history endpoint.
 * The CF Worker fetches from Yahoo Finance (no AWS block) and returns timestamps + closes.
 *
 * Usage:
 *   npx tsx scripts/backfill-cf-history.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WORKER_URL =
  process.env.PRICE_WORKER_URL?.replace(/\/$/, "") ??
  "https://lode-prices.ultra-edward.workers.dev";

async function main() {
  console.log(`\nFetching 30-day history from CF Worker: ${WORKER_URL}/history\n`);

  const res = await fetch(`${WORKER_URL}/history`);
  if (!res.ok) throw new Error(`Worker returned HTTP ${res.status}`);

  const json = (await res.json()) as {
    ok: boolean;
    history: Record<string, { timestamp: string; price: number }[]>;
  };

  if (!json.ok) throw new Error(`Worker error: ${JSON.stringify(json)}`);

  let totalUpserted = 0;

  for (const [metal, points] of Object.entries(json.history)) {
    console.log(`${metal}: ${points.length} trading days`);

    for (const { timestamp: tsStr, price } of points) {
      const timestamp = new Date(tsStr);

      await prisma.price.upsert({
        where:  { metal_timestamp: { metal, timestamp } },
        update: { price },
        create: { metal, price, timestamp },
      });

      console.log(`  ${tsStr.slice(0, 10)}  $${price.toFixed(2)}`);
      totalUpserted++;
    }
  }

  console.log(`\n✅ Done. Upserted ${totalUpserted} rows across all metals.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("\nERROR:", err);
  await prisma.$disconnect();
  process.exit(1);
});
