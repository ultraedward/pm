import { prisma } from "@/lib/prisma";

export async function canCreateAlert(userId: string) {
  const [alertCount, user] = await Promise.all([
    prisma.alert.count({
      where: { userId },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true },
    }),
  ]);

  const isPaid = user?.subscriptionStatus === "active";

  return {
    allowed: isPaid || alertCount < 3,
    alertCount,
    isPaid,
  };
}