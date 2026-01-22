import { prisma } from '@/lib/prisma';

/**
 * Cleanup script to remove obviously bad or stale price data.
 * Prices are stored exclusively in AlertTrigger.
 */
async function run() {
  const result = await prisma.alertTrigger.deleteMany({
    where: {
      OR: [
        { price: { lt: 1 } },
        { price: { gt: 1_000_000 } },
      ],
    },
  });

  console.log(`Deleted ${result.count} invalid alert trigger price records`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });