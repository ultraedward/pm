// lib/getSpotPrice.ts

import { prisma } from "@/lib/prisma";

export async function getSpotPrice(metal: string): Promise<number> {
  const latest = await prisma.spotPriceCache.findFirst({
    where: { metal },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) {
    throw new Error(`No price data for ${metal}`);
  }

  return Number(latest.price);
}
