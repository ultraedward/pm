import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.METALS_API_KEY;

if (!API_KEY) {
  throw new Error("METALS_API_KEY missing");
}

async function fetchHistoricalPrice(
  symbol: "XAU" | "XAG",
  date: string
) {
  const url =
    `https://metals-api.com/api/${date}` +
    `?access_key=${API_KEY}` +
    `&base=USD` +
    `&symbols=${symbol}`;

  console.log("Calling:", url);

  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    console.error("API ERROR:", data);
    throw new Error(`Invalid API response for ${symbol} on ${date}`);
  }

  return data.rates[symbol];
}

async function main() {
  console.log("Backfilling last 30 days...");

  for (let i = 0; i < 30; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    const dateStr = day.toISOString().split("T")[0];

    const goldRate = await fetchHistoricalPrice("XAU", dateStr);
    const silverRate = await fetchHistoricalPrice("XAG", dateStr);

    const gold = 1 / goldRate;
    const silver = 1 / silverRate;

    await prisma.price.upsert({
      where: {
        metal_timestamp: {
          metal: "gold",
          timestamp: day,
        },
      },
      update: { price: gold },
      create: {
        metal: "gold",
        price: gold,
        timestamp: day,
      },
    });

    await prisma.price.upsert({
      where: {
        metal_timestamp: {
          metal: "silver",
          timestamp: day,
        },
      },
      update: { price: silver },
      create: {
        metal: "silver",
        price: silver,
        timestamp: day,
      },
    });

    console.log(`✔ Saved ${dateStr}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});