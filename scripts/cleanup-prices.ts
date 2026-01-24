import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Cleanup script for bad / invalid price rows.
 *
 * IMPORTANT:
 * - This script ONLY operates on Price data
 * - Alert / Trigger cleanup has been permanently removed
 * - Safe to run during build or manually
 */
async function run() {
  const result = await prisma.price.deleteMany({
    where: {
      OR: [
        { price: { lt: 1 } },
        { price: { gt: 1_000_000 } },
        { metal: "" },
      ],
    },
  });

  console.log(`🧹 Cleaned ${result.count} invalid price rows`);
}

run()
  .catch((err) => {
    console.error("cleanup-prices failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });