import { prisma } from "../lib/prisma";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.METALS_API_KEY;

if (!API_KEY) {
  throw new Error("METALS_API_KEY missing");
}

async function fetchTimeSeries() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];

  const url = `https://metals-api.com/api/timeseries?access_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&base=USD&symbols=XAU,XAG`;

  console.log("Calling:", url);

  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    console.error("FULL API RESPONSE:", data);
    throw new Error("Invalid API response");
  }

  return data.rates;
}

async function saveTimeSeries(rates: any) {
  for (const date in rates) {
    const dayRates = rates[date];

    const gold = 1 / dayRates.XAU;
    const silver = 1 / dayRates.XAG;

    const timestamp = new Date(date);

    await prisma.price.upsert({
      where: {
        metal_timestamp: {
          metal: "gold",
          timestamp,
        },
      },
      update: {
        price: gold,
      },
      create: {
        metal: "gold",
        price: gold,
        timestamp,
      },
    });

    await prisma.price.upsert({
      where: {
        metal_timestamp: {
          metal: "silver",
          timestamp,
        },
      },
      update: {
        price: silver,
      },
      create: {
        metal: "silver",
        price: silver,
        timestamp,
      },
    });
  }
}

async function main() {
  console.log("Fetching 30-day time series...");
  const rates = await fetchTimeSeries();
  await saveTimeSeries(rates);
  console.log("Done.");
}

main().finally(() => prisma.$disconnect());