import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const result = await prisma.priceHistory.deleteMany({
    where: {
      OR: [
        { price: { lt: 1 } },
        { price: { gt: 20000 } },
      ],
    },
  });

  console.log('Deleted rows:', result.count);
  await prisma.$disconnect();
}

run();
