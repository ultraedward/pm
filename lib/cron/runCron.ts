import { prisma } from "@/lib/prisma";
import { fetchPrices } from "@/lib/prices/fetchPrices";
import { evaluateAlert } from "@/lib/alerts/evaluateAlert";

export async function runCronJob() {
  const prices = await fetchPrices();

  for (const p of prices) {
    const alerts = await prisma.alert.findMany({
      where: {
        metal: p.metal,
        active: true,
      },
    });

    for (const alert of alerts) {
      const shouldTrigger = evaluateAlert(
        alert.price,
        p.price,
        alert.direction
      );

      if (!shouldTrigger) continue;

      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          lastTriggeredAt: new Date(),
        },
      });
    }
  }

  return {
    ok: true,
  };
}