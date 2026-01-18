import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean slate
  await prisma.alertTrigger.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.user.deleteMany();

  // Create system user (ONLY fields that exist)
  const user = await prisma.user.create({
    data: {
      email: "system@pm.local",
    },
  });

  // Create alerts
  await prisma.alert.createMany({
    data: [
      {
        userId: user.id,
        metal: "gold",
        direction: "above",
        targetPrice: 2100,
      },
      {
        userId: user.id,
        metal: "silver",
        direction: "below",
        targetPrice: 22,
      },
    ],
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
