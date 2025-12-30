// FILE: lib/alertsChecker.js
import prisma from "./prisma";
import sendAlertEmail from "./mailer";

async function runAlertsChecker() {
  const alerts = await prisma.alert.findMany({
    include: { user: true, metal: true },
  });

  for (const alert of alerts) {
    const price = alert.metal.price;

    const hit =
      (alert.direction === "above" && price >= alert.targetPrice) ||
      (alert.direction === "below" && price <= alert.targetPrice);

    if (hit) {
      await sendAlertEmail(
        alert.user.email,
        "Price Alert Triggered",
        `<p><strong>${alert.metal.name}</strong> alert triggered.</p>
         <p>Target: ${alert.targetPrice}</p>
         <p>Current: ${price}</p>`
      );
    }
  }
}

export const runAlertChecks = runAlertsChecker;
export default runAlertsChecker;
