import { prisma } from "@/lib/prisma";

export async function getDashboardStatus() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    lastCron,
    activeAlerts,
    triggeredToday,
    emailStats,
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
    prisma.emailLog.groupBy({
      by: ["status"],
      _count: { status: true },
      where: {
        createdAt: { gte: startOfToday },
      },
    }),
  ]);

  const emailCounts: Record<string, number> = {
    queued: 0,
    retry: 0,
    sent: 0,
    failed: 0,
  };

  for (const row of emailStats) {
    emailCounts[row.status] = row._count.status;
  }

  return {
    lastCron,
    activeAlerts,
    triggeredToday,
    emailCounts,
  };
}