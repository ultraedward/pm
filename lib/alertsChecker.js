import prisma from "./prisma";
import sendAlertEmail from "./mailer";

/**
 * Core alert checking logic
 */
async function runAlertsChecker() {
  const alerts = await prisma.alert.findMany({
    include: { user: true, metal: true },
  });

  for (const alert of alerts) {
    const price = alert.metal.price;

    if (
      (alert.direction === "above" && price >= alert.targetPrice) ||
      (alert.direction === "below" && price <= alert.targetPrice)
    ) {
      await sendAlertEmail(
        alert.user.email,
        "Price Alert Triggered",
        `
          <p>Your alert for <strong>${alert.metal.name}</strong> was triggered.</p>
          <p>Target: ${alert.targetPrice}</p>
          <p>Current: ${price}</p>
        `
      );
    }
  }
}

/**
 * Named exports (ALL aliases used across the app)
 */
export const runAlertChecks = runAlertsChecker;
export const runAlertsCheckerNamed = runAlertsChecker;

/**
 * Default export (used by auto-move-prices.js)
 */
export default runAlertsChecker;
