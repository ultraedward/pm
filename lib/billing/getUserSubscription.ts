import { prisma } from "@/lib/prisma";

export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) return null;

  return {
    status: user.subscriptionStatus,
    customerId: user.stripeCustomerId,
    subscriptionId: user.stripeSubscriptionId,
    currentPeriodEnd: user.stripeCurrentPeriodEnd,
  };
}