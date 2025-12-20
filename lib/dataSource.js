// FILE: lib/dataSource.js
import prisma from "./prisma";

const useMock = process.env.USE_MOCK_DATA === "true";

function movingPrice(base, phase) {
  const t = Date.now() / 1000;
  const wave = Math.sin(t / 6 + phase) * 0.018; // smooth movement
  return Number((base * (1 + wave)).toFixed(2));
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
    return Array.from({ length: 60 }).map((_, i) => ({
      date: `T-${59 - i}`,
      price: movingPrice(2050 + i * 1.2, i / 7),
    }));
  }

  return prisma.price.findMany({ orderBy: { date: "asc" } });
}

export async function getAlerts() {
  if (useMock) {
    return [
      { id: "demo-1", metal: { name: "Gold" }, targetPrice: 2200, direction: "above" },
      { id: "demo-2", metal: { name: "Silver" }, targetPrice: 25, direction: "below" },
    ];
  }

  return prisma.alert.findMany({ include: { metal: true } });
}
