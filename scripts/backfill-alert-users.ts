// @ts-nocheck

import { prisma } from "@/lib/prisma";

async function main() {
  const firstUser = await prisma.user.findFirst();

  if (!firstUser) {
    console.log("No users found. Skipping backfill.");
    return;
  }

  await prisma.alert.updateMany({
    where: {
      userId: { equals: null },
    },
    data: {
      userId: firstUser.id,
    },
  });

  console.log("Alert userId backfill complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
