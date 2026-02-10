import { prisma } from "@/lib/prisma";

export async function getSystemStatus() {
  const [users, alerts, activeAlerts] = await Promise.all([
    prisma.user.count(),
    prisma.alert.count(),
    prisma.alert.count({
      where: { active: true },
    }),
  ]);

  return {
    users,
    alerts,
    activeAlerts,
    lastCronRun: null,
    status: "ok",
  };
}