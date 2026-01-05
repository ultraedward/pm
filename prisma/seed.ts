// prisma/seed.ts

import { prisma } from "@/lib/prisma";

async function main() {
  // Minimal safe seed
  // Do NOT reference removed models (Metal, Price)

  const existingUser = await prisma.user.findFirst();

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: "seed@example.com",
      },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
