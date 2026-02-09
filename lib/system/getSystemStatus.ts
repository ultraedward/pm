import { prisma } from "@/lib/prisma";

export async function getSystemStatus() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    lastCron,
    activeAlerts,
    triggeredToday,
  ] = await Promise.all([
    prisma.cronRun.findFirst({
      orderBy: { startedAt: "desc" },
    }),
    prisma.alert.count({
      where: { active: true },
    }),
    prisma.alertTrigger.count({
      where: {
        triggeredAt: { gte: startOfToday },
      },
    }),
  ]);

  return {
    lastCron,
    activeAlerts,
    triggeredToday,
  };
}