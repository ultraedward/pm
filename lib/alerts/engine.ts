import { prisma } from '@/lib/prisma';

/**
 * Alert Engine (idempotent)
 * - Uses the latest PriceHistory row per metal
 * - Sets trigger.triggeredAt = latest.timestamp (stable)
 * - Skips creating a trigger if one already exists for (alertId + triggeredAt)
 * - Only sets deliveredAt after notify succeeds
 */
export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany();

  let fired = 0;

  for (const alert of alerts) {
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { timestamp: 'desc' },
    });

    if (!latest) continue;

    const price = latest.price;
    const triggeredAt = latest.timestamp;

    const shouldFire =
      (alert.direction === 'above' && price >= alert.targetPrice) ||
      (alert.direction === 'below' && price <= alert.targetPrice);

    if (!shouldFire) continue;

    // ✅ idempotency: if we've already created a trigger for this same price point/time, skip
    const existing = await prisma.alertTrigger.findFirst({
      where: {
        alertId: alert.id,
        triggeredAt: triggeredAt,
      },
      select: { id: true, deliveredAt: true },
    });

    if (existing) {
      // If it exists but wasn't delivered, attempt delivery again.
      if (!existing.deliveredAt) {
        try {
          const { notifyTrigger } = await import('./notify');
          await notifyTrigger(existing.id);

          await prisma.alertTrigger.update({
            where: { id: existing.id },
            data: { deliveredAt: new Date() },
          });
        } catch (e) {
          // swallow, try next run
        }
      }
      continue;
    }

    // Create trigger (NOT delivered yet)
    const trigger = await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        price: price,
        triggeredAt: triggeredAt,
      },
    });

    // Attempt delivery + mark deliveredAt
    try {
      const { notifyTrigger } = await import('./notify');
      await notifyTrigger(trigger.id);

      await prisma.alertTrigger.update({
        where: { id: trigger.id },
        data: { deliveredAt: new Date() },
      });
    } catch (e) {
      // delivery failed; leave deliveredAt null so it can retry on next run
    }

    fired += 1;
  }

  return { checked: alerts.length, fired };
}
