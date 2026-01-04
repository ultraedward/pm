"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/* CREATE ALERT */
export async function createAlert(formData: FormData) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });
  if (!user) return;

  const metal = formData.get("metal") as string;
  const direction = formData.get("direction") as string;
  const threshold = Number(formData.get("threshold"));

  await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
      threshold,
      active: true,
    },
  });

  revalidatePath("/dashboard");
}

/* TOGGLE ALERT */
export async function toggleAlert(formData: FormData) {
  const alertId = formData.get("alertId") as string;
  if (!alertId) return;

  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    select: { active: true },
  });
  if (!alert) return;

  await prisma.alert.update({
    where: { id: alertId },
    data: { active: !alert.active },
  });

  revalidatePath("/dashboard");
}

/* DELETE ALERT */
export async function deleteAlert(formData: FormData) {
  const alertId = formData.get("alertId") as string;
  if (!alertId) return;

  await prisma.alert.delete({
    where: { id: alertId },
  });

  revalidatePath("/dashboard");
}
