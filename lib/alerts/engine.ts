import { prisma } from "@/lib/prisma";

type TriggerResult = {
  triggerId: string;
  metal: string;
  price: number;
  threshold: number;
  condition: "above" | "below";
};

export async function runAlertEngine(): Promise<TriggerResult[]> {
  const triggers = await prisma.alertTrigger.findMany({
    where: {
      triggeredAt: {
        isSet: false,
      },
    },
    include: {
      alert: {
        select: {
          metal: true,
          condition: true,
          threshold: true,
        },
      },
    },
  });

  const results: TriggerResult[] = [];

  for (const trigger of triggers) {
    const { metal, condition, threshold } = trigger.alert;

    const latestPrice = await prisma.priceHistory.findFirst({
      where: { metal },
      orderBy: { timestamp: "desc" },
      select: { price: true },
    });

    if (!latestPrice) continue;

    const hit =
      condition === "above"
        ? latestPrice.price >= threshold
        : latestPrice.price <= threshold;

    if (!hit) continue;

    await prisma.alertTrigger.update({
      where: { id: trigger.id },
      data: {
        triggeredAt: new Date(),
        price: latestPrice.price,
      },
    });

    results.push({
      triggerId: trigger.id,
      metal,
      price: latestPrice.price,
      threshold,
      condition,
    });
  }

  return results;
}
