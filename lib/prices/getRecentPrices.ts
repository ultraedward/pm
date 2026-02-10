import { prisma } from "@/lib/prisma";

export async function getRecentPrices() {
  const prices = await prisma.price.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const grouped = {
    gold: [] as { price: number; time: Date }[],
    silver: [] as { price: number; time: Date }[],
  };

  for (const p of prices) {
    grouped[p.metal as "gold" | "silver"].push({
      price: p.price,
      time: p.createdAt,
    });
  }

  return grouped;
}