/**
 * Backfills daily price history for all 4 metals using Stooq (free, no API key).
 * Fetches the full date range in one request per metal (4 total).
 *
 * Usage:
 *   npm run timeseries
 *   npm run timeseries -- --days=60
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const METALS: { name: string; symbol: string }[] = [
  { name: "gold",      symbol: "xauusd" },
  { name: "silver",    symbol: "xagusd" },
  { name: "platinum",  symbol: "xptusd" },
  { name: "palladium", symbol: "xpdusd" },
];

function toStooqDate(d: Date): string {
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

/**
 * Fetch daily closing prices from Stooq for a given symbol and date range.
 * Returns a Map of YYYY-MM-DD → close price.
 */
async function fetchHistory(
  symbol: string,
  days: number
): Promise<Map<string, number>> {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);

  const url =
    `https://stooq.com/q/d/l/` +
    `?s=${symbol}` +
    `&d1=${toStooqDate(start)}` +
    `&d2=${toStooqDate(end)}` +
    `&i=d`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) {
    throw new Error(`Stooq returned HTTP ${res.status} for ${symbol}`);
  }

  const text = await res.text();

  // Stooq returns "No data" when symbol isn't found
  if (text.trim().startsWith("No data") || text.trim() === "") {
    throw new Error(`No data returned for symbol "${symbol}" — check the symbol name`);
  }

  // Parse CSV: Date,Open,High,Low,Close,Volume
  const lines = text.trim().split("\n").slice(1); // skip header
  const map = new Map<string, number>();

  for (const line of lines) {
    const cols = line.split(",");
    if (cols.length < 5) continue;
    const date = cols[0].trim();
    const close = parseFloat(cols[4].trim());
    if (!isNaN(close) && close > 0) {
      map.set(date, Number(close.toFixed(2)));
    }
  }

  return map;
}

async function main() {
  const daysArg = process.argv.find((a) => a.startsWith("--days="));
  const DAYS = daysArg ? parseInt(daysArg.split("=")[1], 10) : 30;

  console.log(`\nBackfilling last ${DAYS} days for all 4 metals via Stooq...\n`);

  let totalUpserted = 0;

  for (const { name, symbol } of METALS) {
    process.stdout.write(`Fetching ${name} (${symbol})... `);

    let history: Map<string, number>;
    try {
      history = await fetchHistory(symbol, DAYS);
    } catch (err) {
      console.error(`\n  ✗ ${(err as Error).message}`);
      continue;
    }

    console.log(`${history.size} trading days`);

    for (const [dateStr, price] of history) {
      const timestamp = new Date(`${dateStr}T00:00:00.000Z`);

      await prisma.price.upsert({
        where: { metal_timestamp: { metal: name, timestamp } },
        update: { price },
        create: { metal: name, price, timestamp },
      });

      process.stdout.write(`  ${dateStr}  $${price.toFixed(2)}\n`);
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
