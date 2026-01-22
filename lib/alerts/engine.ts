import { prisma } from '@/lib/prisma';

type EngineResult = {
  checked: number;
  fired: number;
};

export async function runAlertEngine(): Promise<EngineResult> {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
  });

  let checked = 0;
  let fired = 0;

  for (const alert of alerts) {
    checked++;

    // Get latest price for this metal
    const latestTrigger = await prisma.alertTrigger.findFirst({
      where: {
        alert: {
          metal: alert.metal,
        },
      },
      orderBy: {
        triggeredAt: 'desc',
      },
    });

    if (!latestTrigger) continue;

    const price = latestTrigger.price;

    const shouldFire =
      alert.direction === 'above'
        ? price >= alert.target
        : price <= alert.target;

    if (!shouldFire) continue;

    // Dedup enforced by unique(alertId, price)
    try {
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price,
          triggeredAt: new Date(),
        },
      });

      fired++;
    } catch {
      // duplicate trigger → ignore
    }
  }

  return { checked, fired };
}