// lib/getSpotPrice.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { prisma } from "@/lib/prisma";

/**
 * Returns the most recent spot price for a metal, or null if none exists.
 */
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
