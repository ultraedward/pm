import { prisma } from "@/lib/prisma";

export async function getUserAlerts(userId: string) {
  const alerts = await prisma.alert.findMany({
    where: { userId },
    include: {
      triggers: {
        orderBy: { triggeredAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return alerts;
}