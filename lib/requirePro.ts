import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";

/**
 * Requires the current user to have an active Pro subscription.
 * Redirects to /pricing if they don't.
 */
export async function requirePro() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { subscriptionStatus: true, proUntil: true },
  });

  const isPro = hasProAccess({
    stripeStatus: dbUser?.subscriptionStatus,
    proUntil: dbUser?.proUntil,
  });

  if (!isPro) {
    redirect("/pricing");
  }

  return user;
}
