import { prisma } from "@/lib/prisma";

const TEN_MINUTES = 10 * 60 * 1000;

export async function updateMetalsPrices() {
  try {
    const latest = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" }
    });

    const now = Date.now();

    // Return cached prices if they are fresh
    if (latest && now - new Date(latest.timestamp).getTime() < TEN_MINUTES) {
      const latestPrices = await prisma.price.findMany({
        orderBy: { timestamp: "desc" },
        take: 2
      });

      const gold = latestPrices.find(p => p.metal === "gold")?.price ?? null;
      const silver = latestPrices.find(p => p.metal === "silver")?.price ?? null;

      return {
        ok: true,
        gold,
        silver,
        source: "database"
      };
    }

    // Fetch fresh prices
    const response = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Metals API request failed");
    }

    // Metals‑API returns XAU and XAG as metal per USD when base=USD
    // Convert to USD per ounce by inverting the rate
    const gold = Number((1 / data.rates.XAU).toFixed(2));
    const silver = Number((1 / data.rates.XAG).toFixed(2));

    const timestamp = new Date();

    await prisma.price.createMany({
      data: [
        { metal: "gold", price: gold, timestamp },
        { metal: "silver", price: silver, timestamp }
      ]
    });

    // Only run compression roughly once per hour to avoid heavy DB work
    const shouldRunCompression = !latest || (now - new Date(latest.timestamp).getTime() > 60 * 60 * 1000);

    if (shouldRunCompression) {
      // Smart history compression
      // 0‑7 days: keep all records
      // 7‑30 days: keep one record per hour
      // 30‑365 days: keep one record per day
      // >365 days: delete

      const nowTime = Date.now();

      const sevenDays = new Date(nowTime - 7 * 24 * 60 * 60 * 1000);
      const thirtyDays = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
      const oneYear = new Date(nowTime - 365 * 24 * 60 * 60 * 1000);

      // Delete extremely old data (>1 year)
      await prisma.price.deleteMany({
        where: {
          timestamp: {
            lt: oneYear
          }
        }
      });

      // Reduce 30‑365 day data to daily resolution
      await prisma.$executeRaw`
        DELETE FROM "Price"
        WHERE id NOT IN (
          SELECT MIN(id)
          FROM "Price"
          WHERE timestamp < ${sevenDays} AND timestamp >= ${thirtyDays}
          GROUP BY metal, DATE(timestamp)
        )
        AND timestamp < ${sevenDays}
        AND timestamp >= ${thirtyDays}
      `;

      // Reduce 7‑30 day data to hourly resolution
      await prisma.$executeRaw`
        DELETE FROM "Price"
        WHERE id NOT IN (
          SELECT MIN(id)
          FROM "Price"
          WHERE timestamp < ${sevenDays} AND timestamp >= ${thirtyDays}
          GROUP BY metal, DATE_TRUNC('hour', timestamp)
        )
        AND timestamp < ${sevenDays}
        AND timestamp >= ${thirtyDays}
      `;
    }

    return {
      ok: true,
      gold,
      silver,
      source: "api"
    };

  } catch (error) {
    console.error("Price engine failure:", error);

    return {
      ok: false,
      gold: null,
      silver: null,
      source: "error"
    };
  }
}

export async function getPriceHistory(range: "24h" | "7d" | "30d" | "1y") {
  const now = Date.now();

  let start: Date;

  if (range === "24h") {
    start = new Date(now - 24 * 60 * 60 * 1000);
  } else if (range === "7d") {
    start = new Date(now - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    start = new Date(now - 30 * 24 * 60 * 60 * 1000);
  } else {
    start = new Date(now - 365 * 24 * 60 * 60 * 1000);
  }

  const prices = await prisma.price.findMany({
    where: {
      timestamp: {
        gte: start
      }
    },
    orderBy: {
      timestamp: "asc"
    }
  });

  const gold = prices.filter(p => p.metal === "gold");
  const silver = prices.filter(p => p.metal === "silver");

  return {
    gold,
    silver
  };
}

export async function getPriceHistory(
  range: "24h" | "7d" | "30d" | "1y"
) {
  const now = new Date();

  let start = new Date();

  if (range === "24h") {
    start.setHours(now.getHours() - 24);
  } else if (range === "7d") {
    start.setDate(now.getDate() - 7);
  } else if (range === "30d") {
    start.setDate(now.getDate() - 30);
  } else if (range === "1y") {
    start.setFullYear(now.getFullYear() - 1);
  }

  const rows = await prisma.price.findMany({
    where: {
      timestamp: { gte: start }
    },
    orderBy: {
      timestamp: "asc"
    }
  });

  const gold = rows
    .filter((p) => p.metal === "gold")
    .map((p) => ({
      price: p.price,
      timestamp: p.timestamp
    }));

  const silver = rows
    .filter((p) => p.metal === "silver")
    .map((p) => ({
      price: p.price,
      timestamp: p.timestamp
    }));

  return { gold, silver };
}