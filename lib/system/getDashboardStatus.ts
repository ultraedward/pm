import { prisma } from "@/lib/prisma";

export async function getDashboardStatus() {
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
    emailLogs: 0,
  };
}