import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

/**
 * Requires the current user to have an active Pro subscription.
 * Redirects to /pricing if they don't.
 */
export async function requirePro() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { subscriptionStatus: true },
  });

  const isPro =
    dbUser?.subscriptionStatus === "active" ||
    dbUser?.subscriptionStatus === "trialing";

  if (!isPro) {
    redirect("/pricing");
  }

  return user;
}
