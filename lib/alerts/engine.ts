import { prisma } from "@/lib/prisma";
import { queueEmail } from "@/lib/emailQueue";

/**
 * Evaluate and trigger a single alert (used by /alerts/run)
 */
export async function evaluateAlert(alertId: string, price: number) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: {
      user: true,
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
    },
  });

  if (!alert || !alert.active) return { triggered: false };

  const conditionMet =
    (alert.direction === "above" && price >= alert.price) ||
    (alert.direction === "below" && price <= alert.price);

  if (!conditionMet) return { triggered: false };

  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      price,
      triggeredAt: new Date(),
    },
  });

  await queueEmail({
    alertId: alert.id,
    to: alert.user.email,
    subject: `Alert triggered: ${alert.metal}`,
    html: `
      <h2>Price Alert Triggered</h2>
      <p><b>Metal:</b> ${alert.metal}</p>
      <p><b>Direction:</b> ${alert.direction}</p>
      <p><b>Target Price:</b> ${alert.price}</p>
      <p><b>Current Price:</b> ${price}</p>
    `,
  });

  return { triggered: true };
}

/**
 * Batch alert engine (cron)
 */
export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: {
      user: true,
    },
  });

  for (const alert of alerts) {
    await evaluateAlert(alert.id, alert.price);
  }
}