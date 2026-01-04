"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function createAlert(
  metal: string,
  direction: "above" | "below",
  threshold: number
) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.email) {
    throw new Error("Unauthorized");
  }

  // ✅ Resolve DB user (session user has no id)
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  await prisma.alert.create({
    data: {
      userId: dbUser.id,
      metal,
      direction,
      threshold,
      active: true,
    },
  });
}
