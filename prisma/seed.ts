import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding spot price cache…");

  const metals = [
    { metal: "gold", base: 1950 },
    { metal: "silver", base: 23 },
  ];

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  for (const { metal, base } of metals) {
    let price = base;

    for (let i = 30; i >= 0; i--) {
      // small random walk
      price += (Math.random() - 0.5) * (metal === "gold" ? 15 : 0.4);

      await prisma.spotPriceCache.create({
        data: {
          metal,
          price: Number(price.toFixed(2)),
          createdAt: new Date(now - i * DAY),
        },
      });
    }
  }

  console.log("✅ Spot price cache seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
