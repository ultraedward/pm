import { prisma } from "@/lib/prisma";
import { getSpotPrice } from "@/lib/getSpotPrice";

export async function runAlertEngine(
  now: Date = new Date()
) {
  const triggers = await prisma.alertTrigger.findMany({
    where: {
      triggeredAt: null,
    },
    include: {
      alert: {
        select: {
          metal: true,
          threshold: true,
        },
      },
    },
  });

  const results = [];

  for (const trigger of triggers) {
    const spot = await getSpotPrice(trigger.alert.metal);
    if (spot === null) continue;

    const shouldTrigger = spot >= trigger.alert.threshold;

    if (!shouldTrigger) continue;

    const updated = await prisma.alertTrigger.update({
      where: { id: trigger.id },
      data: {
        triggeredAt: now,
        price: spot,
      },
    });

    results.push(updated);
  }

  return {
    checked: triggers.length,
    triggered: results.length,
  };
}
