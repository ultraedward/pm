import { prisma } from '@/lib/prisma';

export async function getSpotPrice(
  metal: string
): Promise<number | null> {
  const latest = await prisma.alertTrigger.findFirst({
    where: {
      alert: {
        metal,
      },
    },
    orderBy: {
      triggeredAt: 'desc',
    },
    select: {
      price: true,
    },
  });

  return latest?.price ?? null;
}