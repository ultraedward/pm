"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* ---------------- helpers ---------------- */

async function getDbUserId() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.email) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  return dbUser.id;
}

/* ---------------- actions ---------------- */

export async function createAlert(
  metal: string,
  direction: "above" | "below",
  threshold: number
) {
  const userId = await getDbUserId();

  await prisma.alert.create({
    data: {
      userId,
      metal,
      direction,
      threshold,
      active: true,
    },
  });
}

export async function toggleAlert(alertId: string) {
  const userId = await getDbUserId();

  const alert = await prisma.alert.findFirst({
    where: { id: alertId, userId },
    select: { active: true },
  });

  if (!alert) {
    throw new Error("Alert not found");
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { active: !alert.active },
  });
}

export async function deleteAlert(alertId: string) {
  const userId = await getDbUserId();

  await prisma.alert.deleteMany({
    where: { id: alertId, userId },
  });
}
