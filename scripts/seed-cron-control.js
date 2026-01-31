import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.cronControl.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      cronEnabled: true,
    },
  });

  console.log("✅ Cron control seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());