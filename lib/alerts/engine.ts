import { prisma } from "@/lib/prisma";

export async function runAlertEngine(latestPrices: Record<string, number>) {
  const triggers = await prisma.alertTrigger.findMany({
    where: {
      triggeredAt: null,
    },
    include: {
      alert: {
        select: {
          metal: true,
          direction: true,
          targetPrice: true,
        },
      },
    },
  });

  for (const trigger of triggers) {
    const { metal, direction, targetPrice } = trigger.alert;

    if (targetPrice == null) continue;

    const currentPrice = latestPrices[metal];
    if (currentPrice == null) continue;

    const shouldTrigger =
      direction === "above"
        ? currentPrice >= targetPrice
        : currentPrice <= targetPrice;

    if (!shouldTrigger) continue;

    await prisma.alertTrigger.update({
      where: { id: trigger.id },
      data: {
        triggeredAt: new Date(),
        price: currentPrice,
      },
    });
  }
}
