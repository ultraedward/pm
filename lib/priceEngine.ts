import { prisma } from "@/lib/prisma";

const TEN_MINUTES = 10 * 60 * 1000;

// Stooq symbols for spot prices — free, no API key required
const STOOQ_SYMBOLS: Record<string, string> = {
  gold:      "xauusd",
  silver:    "xagusd",
  platinum:  "xptusd",
  palladium: "xpdusd",
};

function toStooqDate(d: Date): string {
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

/**
 * Fetches today's (or most recent) spot price from Stooq.
 * Requests the last 3 days to handle weekends/holidays and returns the latest close.
 */
async function fetchStooqSpotPrice(metal: string): Promise<number | null> {
  const symbol = STOOQ_SYMBOLS[metal];
  if (!symbol) return null;

  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 3); // 3-day window to catch non-trading days

  const url =
    `https://stooq.com/q/d/l/?s=${symbol}` +
    `&d1=${toStooqDate(start)}&d2=${toStooqDate(end)}&i=d`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const text = await res.text();
    if (text.trim().startsWith("No data") || text.trim() === "") return null;

    // CSV: Date,Open,High,Low,Close,Volume — take the last row's close
    const lines = text.trim().split("\n").slice(1).filter(Boolean);
    if (lines.length === 0) return null;

    const last = lines[lines.length - 1].split(",");
    const close = parseFloat(last[4]);
    return isNaN(close) || close <= 0 ? null : Number(close.toFixed(2));
  } catch {
    return null;
  }
}

export async function updateMetalsPrices() {
  try {
    const latest = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" },
    });

    const now = Date.now();

    if (latest && now - new Date(latest.timestamp).getTime() < TEN_MINUTES) {
      const latestPrices = await prisma.price.findMany({
        orderBy: { timestamp: "desc" },
        take: 4,
      });

      return {
        ok: true,
        gold: latestPrices.find((p) => p.metal === "gold")?.price ?? null,
        silver: latestPrices.find((p) => p.metal === "silver")?.price ?? null,
        platinum: latestPrices.find((p) => p.metal === "platinum")?.price ?? null,
        palladium: latestPrices.find((p) => p.metal === "palladium")?.price ?? null,
        source: "database",
      };
    }

    // Fetch all 4 metals from Stooq in parallel — free, no API key
    const [gold, silver, platinum, palladium] = await Promise.all([
      fetchStooqSpotPrice("gold"),
      fetchStooqSpotPrice("silver"),
      fetchStooqSpotPrice("platinum"),
      fetchStooqSpotPrice("palladium"),
    ]);

    if (gold === null || silver === null) {
      throw new Error("Yahoo Finance: failed to fetch gold or silver price");
    }

    const timestamp = new Date();

    const priceData: { metal: string; price: number; timestamp: Date }[] = [
      { metal: "gold", price: gold, timestamp },
      { metal: "silver", price: silver, timestamp },
    ];

    if (platinum !== null) {
      priceData.push({ metal: "platinum", price: platinum, timestamp });
    }
    if (palladium !== null) {
      priceData.push({ metal: "palladium", price: palladium, timestamp });
    }

    await prisma.price.createMany({ data: priceData });

    // Compression: prune old data
    const shouldRunCompression =
      !latest ||
      now - new Date(latest.timestamp).getTime() > 60 * 60 * 1000;

    if (shouldRunCompression) {
      const nowTime = Date.now();
      const sevenDays = new Date(nowTime - 7 * 24 * 60 * 60 * 1000);
      const thirtyDays = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
      const oneYear = new Date(nowTime - 365 * 24 * 60 * 60 * 1000);

      await prisma.price.deleteMany({
        where: { timestamp: { lt: oneYear } },
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
      platinum,
      palladium,
      source: "api",
    };
  } catch (error) {
    console.error("Price engine failure:", error);

    return {
      ok: false,
      gold: null,
      silver: null,
      platinum: null,
      palladium: null,
      source: "error",
    };
  }
}

export async function getPriceHistory(
  range: "24h" | "7d" | "30d" | "1y"
) {
  const now = new Date();
  const start = new Date();

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
    where: { timestamp: { gte: start } },
    orderBy: { timestamp: "asc" },
  });

  const byMetal = (metal: string) =>
    rows
      .filter((p) => p.metal === metal)
      .map((p) => ({ price: p.price, timestamp: p.timestamp }));

  return {
    gold: byMetal("gold"),
    silver: byMetal("silver"),
    platinum: byMetal("platinum"),
    palladium: byMetal("palladium"),
  };
}
