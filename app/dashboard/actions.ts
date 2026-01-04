"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createAlert(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const metal = String(formData.get("metal"));
  const direction = String(formData.get("direction"));
  const threshold = Number(formData.get("threshold"));

  await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
      threshold,
      enabled: true,
    },
  });

  revalidatePath("/dashboard");
}

export async function toggleAlert(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id"));

  const alert = await prisma.alert.findFirst({
    where: { id, userId: user.id },
  });

  if (!alert) return;

  await prisma.alert.update({
    where: { id },
    data: { enabled: !alert.enabled },
  });

  revalidatePath("/dashboard");
}

export async function deleteAlert(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id"));

  await prisma.alert.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}
