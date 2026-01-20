import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSpotPrice(metal: string): Promise<number | null> {
  const latest = await prisma.priceHistory.findFirst({
    where: { metal },
    orderBy: { timestamp: 'desc' },
    select: { price: true }
  });

  return latest?.price ?? null;
}
