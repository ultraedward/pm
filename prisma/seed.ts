import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureMetal(name: string, symbol: string, price: number) {
  let metal = await prisma.metal.findFirst({
    where: { symbol },
  });

  if (!metal) {
    metal = await prisma.metal.create({
      data: { name, symbol },
    });
  }

  await prisma.price.create({
    data: {
      metalId: metal.id,
      value: price,
    },
  });
}

async function main() {
  await ensureMetal("Gold", "XAU", 2350.25);
  await ensureMetal("Silver", "XAG", 29.45);
  await ensureMetal("Platinum", "XPT", 980.1);

  const user = await prisma.user.findFirst({
    where: { email: "tester@local.dev" },
  });

  if (!user) {
    await prisma.user.create({
      data: { email: "tester@local.dev" },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
