import { prisma } from "@/lib/prisma";

export async function getLatestPrice(metal: string) {
  return prisma.priceHistory.findFirst({
    where: { metal },
    orderBy: { createdAt: "desc" },
  });
}