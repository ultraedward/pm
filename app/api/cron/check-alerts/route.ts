import { isProUser } from "@/lib/isProUser";

for (const alert of alerts) {
  const pro = await isProUser(alert.userId);

  if (!pro) {
    // Skip silently — no spam, no logs
    continue;
  }

  const latest = await prisma.priceHistory.findFirst({
    where: { metal: alert.metal },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) continue;

  const shouldTrigger =
    alert.direction === "above"
      ? latest.price >= alert.target
      : latest.price <= alert.target;

  if (!shouldTrigger) continue;

  // SEND EMAIL
  await sendAlertEmail({
    to: alert.email!,
    metal: alert.metal,
    price: latest.price,
    target: alert.target,
    direction: alert.direction as "above" | "below",
  });

  // LOG TRIGGER
  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      metal: alert.metal,
      target: alert.target,
      direction: alert.direction,
      price: latest.price,
      fingerprint: `${alert.id}-${latest.price}`,
    },
  });

  // DEACTIVATE
  await prisma.alert.update({
    where: { id: alert.id },
    data: { active: false },
  });
}