import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.cronControl.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      enabled: true,
    },
  });

  console.log("✅ CronControl seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });