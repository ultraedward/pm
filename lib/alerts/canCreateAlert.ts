import { prisma } from "@/lib/prisma";

const FREE_ALERT_LIMIT = 3;

export async function canCreateAlert(userId: string) {
  // Check if user is Pro
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const isPro =
    subscription?.status === "active" ||
    subscription?.status === "trialing";

  if (isPro) {
    return {
      allowed: true,
      isPro: true,
      remaining: null,
    };
  }

  // Count active alerts
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