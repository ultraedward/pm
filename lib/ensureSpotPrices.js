import prisma from "./prisma.js";

export default async function ensureSpotPrices() {
  const count = await prisma.spotPriceCache.count();
  if (count > 0) return;

  const metals = [
    { metal: "XAU", price: 2025.5 },
    { metal: "XAG", price: 24.35 },
    { metal: "XPT", price: 915.2 },
    { metal: "XPD", price: 1180.0 },
  ];

  for (const m of metals) {
    await prisma.spotPriceCache.create({
      data: {
        metal: m.metal,
        price: m.price,
      },
    });
  }

  console.log("✅ Spot prices auto-seeded");
}
