import { prisma } from "@/lib/prisma";
import { fetchPrices } from "@/lib/prices/fetchPrices";
import {
  evaluateAlert,
  type AlertDirection,
} from "@/lib/alerts/evaluateAlert";

function normalizeDirection(value: string): AlertDirection | null {
  if (value === "above" || value === "below") {
    return value;
  }
  return null;
}

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
      const direction = normalizeDirection(alert.direction);
      if (!direction) continue;

      const shouldTrigger = evaluateAlert(
        alert.price,
        p.price,
        direction
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

  return { ok: true };