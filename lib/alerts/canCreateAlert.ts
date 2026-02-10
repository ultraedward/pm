import { prisma } from "@/lib/prisma";

export async function canCreateAlert(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      alerts: {
        where: { active: true },
      },
    },
  });

  if (!user) return false;

  const isPro = user.subscriptionStatus === "active";

  if (isPro) return true;

  return user.alerts.length < 3;
}