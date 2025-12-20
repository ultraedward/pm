import prisma from "./prisma";
import sendAlertEmail from "./mailer";

export async function runAlertChecks() {
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
