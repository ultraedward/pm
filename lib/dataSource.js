import prisma from "./prisma";

const useMock = process.env.USE_MOCK_DATA === "true";

/**
 * Deterministic price movement (sin wave)
 */
function movingPrice(base, index) {
  const t = Date.now() / 1000;
  return Number((base + Math.sin(t / 5 + index) * base * 0.015).toFixed(2));
}

export async function getMetals() {
  if (useMock) {
    return [
      { id: "gold", name: "Gold", price: movingPrice(2150, 1) },
      { id: "silver", name: "Silver", price: movingPrice(26.5, 2) },
      { id: "platinum", name: "Platinum", price: movingPrice(980, 3) },
    ];
  }

  return prisma.metal.findMany();
}

export async function getPriceHistory() {
  if (useMock) {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `Day ${i + 1}`,
      price: movingPrice(2000 + i * 2, i),
    }));
  }

  return prisma.price.findMany({ orderBy: { date: "asc" } });
}

export async function getAlerts() {
  if (useMock) {
    return [
      {
        id: "demo-1",
        metal: { name: "Gold" },
        targetPrice: 2200,
        direction: "above",
      },
      {
        id: "demo-2",
        metal: { name: "Silver" },
        targetPrice: 25,
        direction: "below",
      },
    ];
  }

  return prisma.alert.findMany({ include: { metal: true } });
}
