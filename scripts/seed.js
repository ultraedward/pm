import { prisma } from "../lib/prisma.js";

async function seed() {
  const now = Math.floor(Date.now() / 1000);

  await prisma.spotPriceCache.deleteMany();

  await prisma.spotPriceCache.createMany({
    data: [
      { metal: "XAU", price: 2035.12, timestamp: now, change: 0 },
      { metal: "XAG", price: 24.87,  timestamp: now, change: 0 },
      { metal: "XPT", price: 914.55, timestamp: now, change: 0 },
      { metal: "XPD", price: 1056.42, timestamp: now, change: 0 }
    ]
  });

  // also capture history point
  const rows = await prisma.spotPriceCache.findMany();
  await prisma.priceHistory.createMany({
    data: rows.map(r => ({ metal: r.metal, price: r.price }))
  });

  console.log("SEEDED");
}

seed().finally(() => prisma.$disconnect());
