import { prisma } from "./prisma";

export async function evaluateAlerts() {
  const alerts = await prisma.alert.findMany({
    where: { triggered: false },
    include: {
      metal: {
        include: {
          prices: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      }
    }
  });

  for (const alert of alerts) {
    const currentPrice = alert.metal.prices[0]?.price;
    if (!currentPrice) continue;

    const hit =
      (alert.condition === "ABOVE" && currentPrice >= alert.targetPrice) ||
      (alert.condition === "BELOW" && currentPrice <= alert.targetPrice);

    if (hit) {
      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          triggered: true,
          triggeredAt: new Date()
        }
      });
    }
  }
}
