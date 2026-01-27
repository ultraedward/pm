// lib/notificationEngine.ts
import { prisma } from "./prisma";

export async function sendNotifications() {
  const alerts = await prisma.alert.findMany({
    where: {
      triggered: true,
      notified: false,
    },
    include: {
      metal: true,
    },
  });

  for (const alert of alerts) {
    console.log(
      `[NOTIFY] ${alert.metal.name} ${alert.condition} ${alert.targetPrice}`
    );

    await prisma.alert.update({
      where: { id: alert.id },
      data: { notified: true },
    });
  }
}
