// app/lib/priceSource.ts
import prisma from "@/app/lib/prisma";

export type Metal = "gold" | "silver" | "platinum" | "palladium";

export type PricePoint = {
  metal: Metal;
  price: number;
  timestamp: Date;
};

const USE_MOCK = process.env.NEXT_PUBLIC_PRICE_MODE !== "LIVE";

/**
 * MOCK DATA
 */
function mockCurrentPrices(): Record<Metal, number> {
  return {
    gold: 2050,
    silver: 25.4,
    platinum: 920,
    palladium: 980,
  };
}

function mockHistory(hours = 24): PricePoint[] {
  const now = Date.now();
  const metals: Metal[] = ["gold", "silver", "platinum", "palladium"];
  const base = mockCurrentPrices();

  const data: PricePoint[] = [];

  for (let i = hours; i >= 0; i--) {
    for (const metal of metals) {
      data.push({
        metal,
        price: base[metal] * (1 + (Math.random() - 0.5) * 0.01),
        timestamp: new Date(now - i * 60 * 60 * 1000),
      });
    }
  }

  return data;
}

/**
 * PUBLIC API
 */
export async function getCurrentPrices() {
  if (USE_MOCK) {
    return {
      source: "mock",
      prices: mockCurrentPrices(),
      updatedAt: new Date(),
    };
  }

  const latest = await prisma.price.findMany({
    orderBy: { timestamp: "desc" },
    take: 4,
  });

  const prices: Partial<Record<Metal, number>> = {};
  latest.forEach((p) => {
    prices[p.metal as Metal] = p.price;
  });

  return {
    source: "live",
    prices,
    updatedAt: latest[0]?.timestamp ?? null,
  };
}

export async function getPriceHistory(hours = 24): Promise<PricePoint[]> {
  if (USE_MOCK) {
    return mockHistory(hours);
  }

  return prisma.price.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - hours * 60 * 60 * 1000),
      },
    },
    orderBy: { timestamp: "asc" },
  }) as Promise<PricePoint[]>;
}
