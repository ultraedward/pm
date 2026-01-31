import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed the global cron control row.
 * Uses id = 1 by schema design.
 */
async function main() {
  await prisma.cronControl.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      cronEnabled: true,
    },
  });

  console.log("Cron control seeded");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });