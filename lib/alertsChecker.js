import prisma from "./prisma.js";
import sendAlertEmail from "./mailer.js";

/**
 * Run alert checks against current spot prices.
 * Called after prices are updated.
 */
export default async function runAlertsChecker() {
  // 1. Fetch current spot prices
  const spotPrices = await prisma.spotPriceCache.findMany();

  const priceMap = {};
  for (const row of spotPrices) {
    priceMap[row.metal.toLowerCase()] = row.price;
  }

  // 2. Fetch untriggered alerts
  const alerts = await prisma.alert.findMany({
    where: {
      triggered: false,
    },
  });

  // 3. Evaluate alerts
  for (const alert of alerts) {
    const spot = priceMap[alert.metal.toLowerCase()];
    if (!spot) continue;

    const target = Number(alert.target);
    const direction = alert.direction;

    const shouldTrigger =
      (direction === "above" && spot >= target) ||
      (direction === "below" && spot <= target);

    if (!shouldTrigger) continue;

    // 4. Send email
    await sendAlertEmail({
      to: alert.email,
      metal: alert.metal,
      price: spot,
      target,
      direction,
    });

    // 5. Mark alert as triggered
    await prisma.alert.update({
      where: { id: alert.id },
      data: { triggered: true },
    });
  }
}
