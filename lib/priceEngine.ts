import { prisma } from "@/lib/prisma";

let cachedPrices: any = null;
let cacheTimestamp = 0;

const CACHE_DURATION = 30000; // 30 seconds

export async function getCachedPrices() {
  const now = Date.now();

  if (cachedPrices && now - cacheTimestamp < CACHE_DURATION) {
    return cachedPrices;
  }

  const gold = await prisma.price.findFirst({
    where: { metal: "gold" },
    orderBy: { timestamp: "desc" },
  });

  const silver = await prisma.price.findFirst({
    where: { metal: "silver" },
    orderBy: { timestamp: "desc" },
  });

  cachedPrices = {
    gold: gold?.price ?? 0,
    silver: silver?.price ?? 0,
  };

  cacheTimestamp = now;

  return cachedPrices;
}

export async function updateMetalsPrices() {
  const API_KEY = process.env.METALS_API_KEY;

  if (!API_KEY) {
    throw new Error("Missing METALS_API_KEY");
  }

  const res = await fetch(
    `https://api.metals-api.com/v1/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error("Metals API failed");
  }

  const goldPrice = 1 / data.rates.XAU;
  const silverPrice = 1 / data.rates.XAG;

  const now = new Date();

  await prisma.price.createMany({
    data: [
      {
        metal: "gold",
        price: goldPrice,
        timestamp: now,
      },
      {
        metal: "silver",
        price: silverPrice,
        timestamp: now,
      },
    ],
  });

  cachedPrices = {
    gold: goldPrice,
    silver: silverPrice,
  };

  cacheTimestamp = Date.now();

  return cachedPrices;
}