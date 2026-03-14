import { prisma } from "@/lib/prisma";
import { queueEmail } from "@/lib/emailQueue";

/**
 * Evaluate a single alert against the current market price.
 * `currentPrice` must be the live spot price, NOT the alert target.
 */
export async function evaluateAlert(alertId: string, currentPrice: number) {
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
    (alert.direction === "above" && currentPrice >= alert.price) ||
    (alert.direction === "below" && currentPrice <= alert.price);

  if (!conditionMet) return { triggered: false };

  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      price: currentPrice,
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
      <p><b>Target Price:</b> $${alert.price}</p>
      <p><b>Current Price:</b> $${currentPrice}</p>
    `,
  });

  return { triggered: true };
}

/**
 * Batch alert engine — called by cron job.
 * Fetches the latest spot price per metal once, then evaluates
 * all active alerts against those prices.
 */
export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: { user: true },
  });

  if (alerts.length === 0) return;

  // Fetch current spot price for each distinct metal in one pass
  const metals = [...new Set(alerts.map((a) => a.metal))];
  const latestPrices = await Promise.all(
    metals.map((metal) =>
      prisma.price.findFirst({
        where: { metal },
        orderBy: { timestamp: "desc" },
        select: { metal: true, price: true },
      })
    )
  );

  const priceMap: Record<string, number> = {};
  for (const row of latestPrices) {
    if (row) priceMap[row.metal] = row.price;
  }

  for (const alert of alerts) {
    const currentPrice = priceMap[alert.metal];
    if (currentPrice === undefined) continue;
    await evaluateAlert(alert.id, currentPrice);
  }
}
