import { prisma } from "@/lib/prisma";
import { fetchPrices } from "@/lib/prices/fetchPrices";
import {
  evaluateAlert,
  type AlertDirection,
} from "@/lib/alerts/evaluateAlert";
import { convertFromUSD } from "@/lib/fx";

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
      select: {
        id: true,
        price: true,
        direction: true,
        currency: true, // the currency the threshold was entered in
      },
    });

    for (const alert of alerts) {
      const direction = normalizeDirection(alert.direction);
      if (!direction) continue;

      // Convert the current USD spot price into the alert's currency before
      // comparing. This means an AUD alert fires based on the AUD gold price,
      // not the raw USD price — which is what the user actually cares about.
      const alertCurrency = alert.currency ?? "USD";
      const priceInAlertCurrency = await convertFromUSD(p.price, alertCurrency);

      const shouldTrigger = evaluateAlert(
        alert.price,
        priceInAlertCurrency,
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
}
