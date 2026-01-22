import { prisma } from '@/lib/prisma';

type EngineResult = {
  checked: number;
  fired: number;
};

function shouldFire(direction: string, current: number, target: number): boolean {
  if (direction === 'above') return current >= target;
  if (direction === 'below') return current <= target;
  return false;
}

export async function runAlertEngine(): Promise<EngineResult> {
  const now = new Date();

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: { triggers: false },
  });

  let fired = 0;

  for (const alert of alerts) {
    // cooldown check (based on lastTriggeredAt)
    const cooldownMinutes = alert.cooldownMinutes ?? 0;
    if (alert.lastTriggeredAt && cooldownMinutes > 0) {
      const msSince = now.getTime() - new Date(alert.lastTriggeredAt).getTime();
      const msCooldown = cooldownMinutes * 60_000;
      if (msSince < msCooldown) {
        continue;
      }
    }

    // get latest price for that metal
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { timestamp: 'desc' },
      select: { price: true, timestamp: true },
    });

    if (!latest) continue;

    const conditionMet = shouldFire(alert.direction, latest.price, alert.targetPrice);
    if (!conditionMet) continue;

    // Try to create trigger (deduped by @@unique([alertId, triggeredAt]))
    try {
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: latest.price,
          triggeredAt: latest.timestamp,
          deliveredAt: now, // treat as "delivered" for now
        },
      });

      fired++;

      // Update alert lifecycle state
      if (alert.fireOnce) {
        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            active: false,
            lastTriggeredAt: now,
          },
        });
      } else {
        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            lastTriggeredAt: now,
          },
        });
      }
    } catch (err: any) {
      // Prisma unique violation => trigger already exists => ignore
      if (err?.code === 'P2002') {
        // Ensure we still set lastTriggeredAt so cron doesn't keep hammering
        await prisma.alert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: now },
        });
        continue;
      }
      throw err;
    }
  }

  return { checked: alerts.length, fired };
}