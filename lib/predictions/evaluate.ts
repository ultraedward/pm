import { prisma } from "@/lib/prisma";

/**
 * Called by the daily cron after prices are updated.
 * Scores all predictions made yesterday against today's new price.
 */
export async function evaluatePredictions() {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Find all unevaluated predictions from yesterday
  const pending = await prisma.prediction.findMany({
    where: { date: yesterdayStr, correct: null },
  });

  if (pending.length === 0) return;

  // Get today's gold price
  const todayPrice = await prisma.price.findFirst({
    where: { metal: "gold" },
    orderBy: { timestamp: "desc" },
    select: { price: true },
  });

  if (!todayPrice) return;

  for (const p of pending) {
    const priceWentUp = todayPrice.price > p.basePrice;
    const correct =
      (p.direction === "up" && priceWentUp) ||
      (p.direction === "down" && !priceWentUp);

    await prisma.prediction.update({
      where: { id: p.id },
      data: { correct, resultPrice: todayPrice.price },
    });
  }

  console.log(`Evaluated ${pending.length} prediction(s) for ${yesterdayStr}`);
}
