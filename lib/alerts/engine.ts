import { prisma } from '@/lib/prisma';

export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany({
    include: {
      triggers: {
        where: { deliveredAt: null },
      },
    },
  });

  for (const alert of alerts) {
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { timestamp: 'desc' },
    });

    if (!latest) continue;

    const alreadyTriggered = await prisma.alertTrigger.findFirst({
      where: {
        alertId: alert.id,
        deliveredAt: { not: null },
      },
    });

    // 🔒 Prevent double-delivery
    if (alreadyTriggered) continue;

    const shouldTrigger =
      (alert.direction === 'above' && latest.price >= alert.targetPrice) ||
      (alert.direction === 'below' && latest.price <= alert.targetPrice);

    if (!shouldTrigger) continue;

    const trigger = await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        price: latest.price,
        triggeredAt: new Date(),
        deliveredAt: new Date(),
      },
    });

    // Mark any old undelivered triggers as delivered (cleanup)
    await prisma.alertTrigger.updateMany({
      where: {
        alertId: alert.id,
        deliveredAt: null,
        NOT: { id: trigger.id },
      },
      data: { deliveredAt: new Date() },
    });

    await (await import('./notify')).notifyTrigger(trigger.id);
  }
}
