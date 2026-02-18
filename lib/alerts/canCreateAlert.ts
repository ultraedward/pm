import { prisma } from "@/lib/prisma";

const FREE_ALERT_LIMIT = 3;

export async function canCreateAlert(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
    },
  });

  const isPro =
    user?.subscriptionStatus === "active" ||
    user?.subscriptionStatus === "trialing";

  if (isPro) {
    return {
      allowed: true,
      isPro: true,
      remaining: null,
    };
  }

  const count = await prisma.alert.count({
    where: {
      userId,
      active: true,
    },
  });

  const remaining = FREE_ALERT_LIMIT - count;

  return {
    allowed: remaining > 0,
    isPro: false,
    remaining: Math.max(remaining, 0),
  };
}