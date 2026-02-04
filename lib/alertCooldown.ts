import { prisma } from "@/lib/prisma";

const COOLDOWN_MINUTES = 30;

export async function canTriggerAlert(alertId: string) {
  const last = await prisma.alertTrigger.findFirst({
    where: { alertId },
    orderBy: { triggeredAt: "desc" },
  });

  if (!last) return true;

  const elapsed =
    Date.now() - new Date(last.triggeredAt).getTime();

  return elapsed > COOLDOWN_MINUTES * 60 * 1000;
}