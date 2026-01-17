import { prisma } from "../lib/prisma.js";

async function main() {
  const now = new Date();

  await prisma.spotPrice.createMany({
    data: [
      { metal: "Gold", price: 2000, timestamp: now },
      { metal: "Silver", price: 25, timestamp: now },
      { metal: "Platinum", price: 950, timestamp: now },
      { metal: "Palladium", price: 1100, timestamp: now },
    ],
  });

  console.log("Seeded spot prices");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
