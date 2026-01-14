import { prisma } from "@/lib/prisma";

async function main() {
  const firstUser = await prisma.user.findFirst();
  if (!firstUser) return;

  await prisma.alert.updateMany({
    where: { userId: null },
    data: { userId: firstUser.id },
  });

  console.log("Backfilled alerts");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
