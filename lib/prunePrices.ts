import { prisma } from "@/lib/prisma";

export async function prunePriceHistory() {
  const now = new Date();

  const day = 24 * 60 * 60 * 1000;

  const cutoff7d = new Date(now.getTime() - 7 * day);
  const cutoff30d = new Date(now.getTime() - 30 * day);

  const oldPrices = await prisma.price.findMany({
    where: {
      timestamp: {
        lt: cutoff7d,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const deletes: number[] = [];

  for (let i = 0; i < oldPrices.length; i++) {
    const record = oldPrices[i];

    const age = now.getTime() - record.timestamp.getTime();

    if (age > 30 * day) {
      deletes.push(record.id);
      continue;
    }

    if (age > 7 * day) {
      if (i % 60 !== 0) deletes.push(record.id);
    }
  }

  if (deletes.length > 0) {
    await prisma.price.deleteMany({
      where: {
        id: { in: deletes },
      },
    });
  }

  return {
    pruned: deletes.length,
  };
}