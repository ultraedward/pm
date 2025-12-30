import { prisma } from "./prisma";

export async function movePrices() {
  const metals = await prisma.metal.findMany({
    include: {
      prices: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  for (const metal of metals) {
    const lastPrice = metal.prices[0]?.price ?? 100;

    const movement =
      (Math.random() - 0.5) * metal.volatility +
      metal.trendBias;

    const nextPrice = lastPrice * (1 + movement);

    await prisma.price.create({
      data: {
        metalId: metal.id,
        price: Number(nextPrice.toFixed(2)),
      },
    });
  }
}
