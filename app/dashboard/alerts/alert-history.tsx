import prisma from "@/lib/prisma";

export async function getAlertHistory(userId: string) {
  return prisma.alertTrigger.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      alert: true,
    },
  });
}
