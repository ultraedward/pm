import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchMetalPrices() {
  const apiKey = process.env.METALS_API_KEY;

  console.log("Loaded METALS_API_KEY:", apiKey ? "YES" : "NO");

  if (!apiKey) {
    throw new Error("METALS_API_KEY missing");
  }

  const url = `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG`;

  console.log("Calling:", url);

  const response = await fetch(url);
  const data = await response.json();

  console.log("FULL API RESPONSE:");
  console.log(JSON.stringify(data, null, 2));

  if (!data.success) {
    throw new Error("Invalid API response");
  }

  const goldPrice = data.rates?.USDXAU;
  const silverPrice = data.rates?.USDXAG;

  if (!goldPrice || !silverPrice) {
    throw new Error("Missing USDXAU or USDXAG in API response");
  }

  return { goldPrice, silverPrice };
}

async function main() {
  console.log("Backfilling prices...");

  const { goldPrice, silverPrice } = await fetchMetalPrices();

  const timestamp = new Date();

  await prisma.price.create({
    data: {
      metal: "gold",
      price: goldPrice,
      timestamp,
    },
  });

  console.log(`✔ gold saved at ${timestamp.toISOString()}`);

  await prisma.price.create({
    data: {
      metal: "silver",
      price: silverPrice,
      timestamp,
    },
  });

  console.log(`✔ silver saved at ${timestamp.toISOString()}`);

  console.log("Done.");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("ERROR:", err);
  await prisma.$disconnect();
  process.exit(1);
});