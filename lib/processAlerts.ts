import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/mailer";

export async function processAlerts(metalId: string, currentPrice: number) {
  const alerts = await prisma.alert.findMany({
    where: {
      metalId,
      triggered: false,
    },
    include: {
      metal: true,
    },
  });

  for (const alert of alerts) {
    const target = Number(alert.target);

    const shouldTrigger =
      (alert.direction === "above" && currentPrice >= target) ||
      (alert.direction === "below" && currentPrice <= target);

    if (!shouldTrigger) continue;

    await sendAlertEmail({
      to: alert.email,
      metal: alert.metal.name,
      price: currentPrice,
      target,
      direction: alert.direction,
    });

    await prisma.alert.update({
      where: { id: alert.id },
      data: { triggered: true },
    });
  }
}
