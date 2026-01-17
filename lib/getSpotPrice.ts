// lib/getSpotPrice.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { prisma } from "@/lib/prisma";

export async function getSpotPrice(
  metal: string
): Promise<number | null> {
  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
    select: { price: true },
  });

  return latest?.price ?? null;
}
