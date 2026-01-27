import prisma from "./prisma";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

/* -----------------------
   MOCK STATE (in-memory)
------------------------ */
let mockPrices = [
  { id: "gold", name: "Gold", price: 2350 },
  { id: "silver", name: "Silver", price: 29.5 },
  { id: "platinum", name: "Platinum", price: 985 },
];

let mockAlerts = [
  {
    id: "a1",
    metal: { name: "Gold" },
    direction: "above",
    targetPrice: 2400,
  },
  {
    id: "a2",
    metal: { name: "Silver" },
    direction: "below",
    targetPrice: 28,
  },
];

function tickPrice(p) {
  const delta = (Math.random() - 0.5) * 8;
  return Math.max(1, +(p + delta).toFixed(2));
}

/* -----------------------
   PUBLIC API
------------------------ */

export async function getMetals() {
  if (USE_MOCK) {
    mockPrices = mockPrices.map((m) => ({
      ...m,
      price: tickPrice(m.price),
    }));
    return mockPrices;
  }

  return prisma.metal.findMany();
}

export async function getAlerts() {
  if (USE_MOCK) {
    return mockAlerts;
  }

  return prisma.alert.findMany({
    include: { metal: true },
  });
}

export async function getPriceHistory() {
  if (USE_MOCK) {
    const now = Date.now();
    return Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(now - (30 - i) * 60_000).toISOString(),
      price: tickPrice(2300),
    }));
  }

  // real history later
  return [];
}
