import { prisma } from "@/lib/prisma";

const TEN_MINUTES = 10 * 60 * 1000;

export async function updateMetalsPrices() {
  try {
    const latest = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" }
    });

    const now = Date.now();

    if (latest && now - new Date(latest.timestamp).getTime() < TEN_MINUTES) {
      const latestPrices = await prisma.price.findMany({
        orderBy: { timestamp: "desc" },
        take: 2
      });

      const gold =
        latestPrices.find((p) => p.metal === "gold")?.price ?? null;
      const silver =
        latestPrices.find((p) => p.metal === "silver")?.price ?? null;

      return {
        ok: true,
        gold,
        silver,
        source: "database"
      };
    }

    const response = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Metals API request failed");
    }

    const gold = Number((1 / data.rates.XAU).toFixed(2));
    const silver = Number((1 / data.rates.XAG).toFixed(2));

    const timestamp = new Date();

    await prisma.price.createMany({
      data: [
        { metal: "gold", price: gold, timestamp },
        { metal: "silver", price: silver, timestamp }
      ]
    });

    const shouldRunCompression =
      !latest ||
      now - new Date(latest.timestamp).getTime() > 60 * 60 * 1000;

    if (shouldRunCompression) {
      const nowTime = Date.now();
      const sevenDays = new Date(nowTime - 7 * 24 * 60 * 60 * 1000);
      const thirtyDays = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
      const oneYear = new Date(nowTime - 365 * 24 * 60 * 60 * 1000);

      await prisma.price.deleteMany({
        where: {
          timestamp: {
            lt: oneYear
          }
        }
      });

      await prisma.$executeRaw`
        DELETE FROM "Price"
        WHERE id NOT IN (
          SELECT MIN(id)
          FROM "Price"
          WHERE timestamp < ${thirtyDays} AND timestamp >= ${oneYear}
          GROUP BY metal, DATE(timestamp)
        )
        AND timestamp < ${thirtyDays}
        AND timestamp >= ${oneYear}
      `;

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
  } else {
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