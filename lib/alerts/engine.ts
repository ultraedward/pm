import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany();

  for (const alert of alerts) {
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) continue;

    const shouldTrigger =
      (alert.direction === 'above' && latest.price >= alert.targetPrice) ||
      (alert.direction === 'below' && latest.price <= alert.targetPrice);

    if (!shouldTrigger) continue;

    const trigger = await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        price: latest.price,
        triggeredAt: new Date(),
      },
    });

    await (await import('./notify')).notifyTrigger(trigger.id);
  }
}
