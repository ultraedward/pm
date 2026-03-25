import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";

const FREE_ALERT_LIMIT = 1;

export async function canCreateAlert(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      proUntil: true,
    },
  });

  const isPro = hasProAccess({
    stripeStatus: user?.subscriptionStatus,
    proUntil: user?.proUntil,
  });

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