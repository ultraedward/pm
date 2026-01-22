import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const duplicates = await prisma.$queryRaw<
    { alertId: string; price: number }[]
  >`
    SELECT "alertId", price
    FROM "AlertTrigger"
    GROUP BY "alertId", price
    HAVING COUNT(*) > 1
  `;

  for (const dup of duplicates) {
    const rows = await prisma.alertTrigger.findMany({
      where: {
        alertId: dup.alertId,
        price: dup.price,
      },
      orderBy: { createdAt: 'desc' },
    });

    const [, ...toDelete] = rows;

    if (toDelete.length > 0) {
      await prisma.alertTrigger.deleteMany({
        where: { id: { in: toDelete.map(r => r.id) } },
      });
    }
  }

  console.log('Deduplication complete');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());