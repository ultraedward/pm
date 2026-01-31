import { prisma } from "@/lib/prisma";

export async function isProUser(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
    },
  });

  return !!sub;
}