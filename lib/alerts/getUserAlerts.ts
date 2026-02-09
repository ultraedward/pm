import { prisma } from "@/lib/prisma";

export async function getUserAlerts(userId: string) {
  const alerts = await prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
    },
  });

  return alerts.map(alert => ({
    id: alert.id,
    metal: alert.metal,
    price: alert.price,
    direction: alert.direction,
    active: alert.active,
    lastTriggeredAt: alert.triggers[0]?.triggeredAt
      ? alert.triggers[0].triggeredAt.toISOString()
      : null,
  }));
}