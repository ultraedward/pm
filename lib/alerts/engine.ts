import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany();

  for (const alert of alerts) {
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { timestamp: 'desc' },
    });

    if (!latest) continue;

    const hit =
      (alert.direction === 'above' && latest.price >= alert.targetPrice) ||
      (alert.direction === 'below' && latest.price <= alert.targetPrice);

    if (!hit) continue;

    try {
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: latest.price,
          triggeredAt: new Date(),
        },
      });
    } catch (err: any) {
      // UNIQUE(alertId, price) violation → already triggered
      if (err.code !== 'P2002') {
        throw err;
      }
    }
  }

  return { ok: true };
}