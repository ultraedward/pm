import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany();

  let fired = 0;

  for (const alert of alerts) {
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: 'desc' }
    });

    if (!latest) continue;

    const hit =
      (alert.direction === 'above' && latest.price >= alert.targetPrice) ||
      (alert.direction === 'below' && latest.price <= alert.targetPrice);

    if (!hit) continue;

    const alreadyTriggered = await prisma.alertTrigger.findFirst({
      where: { alertId: alert.id }
    });

    if (alreadyTriggered) continue;

    await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        price: latest.price,
        triggeredAt: new Date()
        });

        await (await import('./notify')).notifyTrigger(trigger.id);

        await prisma.alertTrigger.update({
      }
    });

    fired++;
  }

  return { checked: alerts.length, fired };
}
