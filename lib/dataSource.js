import prisma from "./prisma";

const useMock = process.env.USE_MOCK_DATA === "true";

export async function getMetals() {
  if (useMock) {
    return [
      { id: "gold", name: "Gold", price: 2150.25 },
      { id: "silver", name: "Silver", price: 26.45 },
      { id: "platinum", name: "Platinum", price: 980.1 },
    ];
  }

  return prisma.metal.findMany();
}

export async function getPriceHistory() {
  if (useMock) {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `Day ${i + 1}`,
      price: 2000 + Math.random() * 200,
    }));
  }

  return prisma.price.findMany({
    orderBy: { date: "asc" },
  });
}

export async function getAlerts() {
  if (useMock) {
    return [
      {
        id: "a1",
        metal: { name: "Gold" },
        targetPrice: 2100,
        direction: "above",
      },
      {
        id: "a2",
        metal: { name: "Silver" },
        targetPrice: 25,
        direction: "below",
      },
    ];
  }

  return prisma.alert.findMany({
    include: { metal: true },
  });
}
