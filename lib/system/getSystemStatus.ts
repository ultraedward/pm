import { prisma } from "@/lib/prisma"

export async function getSystemStatus() {
  const [lastCron, priceStats, alertCount, triggeredToday] =
    await Promise.all([
      prisma.cronRun.findFirst({
        orderBy: { startedAt: "desc" },
      }),
      prisma.price.groupBy({
        by: ["metal"],
        _max: { timestamp: true },
      }),
      prisma.alert.count({
        where: { isActive: true },
      }),
      prisma.alertTrigger.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])

  return {
    lastCron,
    priceStats,
    alertCount,
    triggeredToday,
  }
}