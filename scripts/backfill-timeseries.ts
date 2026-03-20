import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.METALS_API_KEY;

if (!API_KEY) throw new Error("METALS_API_KEY missing");

const METALS = [
  { symbol: "XAU" as const, name: "gold" },
  { symbol: "XAG" as const, name: "silver" },
  { symbol: "XPT" as const, name: "platinum" },
  { symbol: "XPD" as const, name: "palladium" },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHistoricalPrice(symbol: string, date: string): Promise<number | null> {
  const url =
    `https://metals-api.com/api/${date}` +
    `?access_key=${API_KEY}` +
    `&base=USD` +
    `&symbols=${symbol}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    console.warn(`  ⚠ API error for ${symbol} on ${date}:`, data.error?.info ?? data);
    return null;
  }

  const rate = data.rates?.[symbol];
  if (!rate) return null;

  // metals-api returns how many oz per USD → invert to get USD per oz
  return 1 / rate;
}

async function main() {
  const DAYS = 30;
  console.log(`Backfilling last ${DAYS} days for all 4 metals...\n`);

  for (let i = DAYS - 1; i >= 0; i--) {
    const day = new Date();
    day.setUTCDate(day.getUTCDate() - i);
    day.setUTCHours(0, 0, 0, 0);
    const dateStr = day.toISOString().split("T")[0];

    process.stdout.write(`${dateStr} `);

    for (const { symbol, name } of METALS) {
      const price = await fetchHistoricalPrice(symbol, dateStr);

      if (price === null) {
        process.stdout.write(`  ${name}: skip  `);
        continue;
      }

      await prisma.price.upsert({
        where: { metal_timestamp: { metal: name, timestamp: day } },
        update: { price },
        create: { metal: name, price, timestamp: day },
      });

      process.stdout.write(`  ${name}: $${price.toFixed(2)}`);

      // Small delay to avoid rate limiting
      await sleep(250);
    }

    process.stdout.write("\n");
  }

  console.log("\n✅ Done.");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("ERROR:", err);
  await prisma.$disconnect();
  process.exit(1);
});
