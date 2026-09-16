import { prisma } from "@/lib/prisma";
import { getLivePrices } from "@/lib/prices";
import { checkPriceHealth } from "@/lib/monitoring/priceHealth";

const TEN_MINUTES = 10 * 60 * 1000;

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
        gold:      latestPrices.find((p) => p.metal === "gold")?.price      ?? null,
        silver:    latestPrices.find((p) => p.metal === "silver")?.price    ?? null,
        platinum:  latestPrices.find((p) => p.metal === "platinum")?.price  ?? null,
        palladium: latestPrices.find((p) => p.metal === "palladium")?.price ?? null,
        source: "database",
      };
    }

    // Fetch prices: CF Worker / Yahoo Finance → hardcoded fallback
    const live = await getLivePrices();
    const { Gold: gold, Silver: silver, Platinum: platinum, Palladium: palladium } = live;

    const timestamp = new Date();

    // Tag each row with the upstream it actually came from, so "was this
    // period affected by a source bug" is a query, not git archaeology.
    // Gold/silver: whatever the worker reported ("goldprice-spot" |
    // "yahoo-futures" | unknown if the worker was unreachable). Platinum/
    // palladium: always yahoo-futures today — there's no spot feed for them
    // yet — except when the whole pipeline fell back to hardcoded prices.
    const goldSilverSource = live.source === "fallback" ? "fallback" : (live.goldSilverSource ?? "unknown");
    const otherMetalsSource = live.source === "fallback" ? "fallback" : "yahoo-futures";

    const priceData: { metal: string; price: number; timestamp: Date; source: string }[] = [
      { metal: "gold",      price: gold,      timestamp, source: goldSilverSource },
      { metal: "silver",    price: silver,    timestamp, source: goldSilverSource },
      { metal: "platinum",  price: platinum,  timestamp, source: otherMetalsSource },
      { metal: "palladium", price: palladium, timestamp, source: otherMetalsSource },
    ];

    // Previous per-metal prices, for the day-over-day sanity check below —
    // fetched before the insert so it's genuinely "previous."
    const priorRows = await prisma.price.findMany({
      where: { metal: { in: ["gold", "silver", "platinum", "palladium"] } },
      orderBy: { timestamp: "desc" },
      distinct: ["metal"],
    });
    const priorByMetal = Object.fromEntries(priorRows.map((r) => [r.metal, r.price]));

    await prisma.price.createMany({ data: priceData });

    // Best-effort: never let a monitoring failure block the price write above.
    await checkPriceHealth(live, {
      gold: priorByMetal.gold,
      silver: priorByMetal.silver,
      platinum: priorByMetal.platinum,
      palladium: priorByMetal.palladium,
    });

    // Compression: prune old data (runs at most once per hour)
    const shouldRunCompression =
      !latest || now - new Date(latest.timestamp).getTime() > 60 * 60 * 1000;

    if (shouldRunCompression) {
      const nowTime    = Date.now();
      const sevenDays  = new Date(nowTime - 7  * 24 * 60 * 60 * 1000);
      const thirtyDays = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
      const oneYear    = new Date(nowTime - 365 * 24 * 60 * 60 * 1000);

      await prisma.price.deleteMany({ where: { timestamp: { lt: oneYear } } });

      await prisma.$executeRaw`
        DELETE FROM "Price"
        WHERE id NOT IN (
          SELECT MIN(id) FROM "Price"
          WHERE timestamp < ${thirtyDays} AND timestamp >= ${oneYear}
          GROUP BY metal, DATE(timestamp)
        )
        AND timestamp < ${thirtyDays} AND timestamp >= ${oneYear}
      `;

      await prisma.$executeRaw`
        DELETE FROM "Price"
        WHERE id NOT IN (
          SELECT MIN(id) FROM "Price"
          WHERE timestamp < ${sevenDays} AND timestamp >= ${thirtyDays}
          GROUP BY metal, DATE_TRUNC('hour', timestamp)
        )
        AND timestamp < ${sevenDays} AND timestamp >= ${thirtyDays}
      `;
    }

    return { ok: true, gold, silver, platinum, palladium, source: "live" };
  } catch (error) {
    console.error("Price engine failure:", error);
    return { ok: false, gold: null, silver: null, platinum: null, palladium: null, source: "error" };
  }
}

export async function getPriceHistory(range: "24h" | "7d" | "30d" | "1y") {
  const now   = new Date();
  const start = new Date();

  if      (range === "24h") start.setHours(now.getHours() - 24);
  else if (range === "7d")  start.setDate(now.getDate() - 7);
  else if (range === "30d") start.setDate(now.getDate() - 30);
  else                      start.setFullYear(now.getFullYear() - 1);

  const rows = await prisma.price.findMany({
    where:   { timestamp: { gte: start } },
    orderBy: { timestamp: "asc" },
  });

  const byMetal = (metal: string) =>
    rows.filter((p) => p.metal === metal).map((p) => ({ price: p.price, timestamp: p.timestamp }));

  return {
    gold:      byMetal("gold"),
    silver:    byMetal("silver"),
    platinum:  byMetal("platinum"),
    palladium: byMetal("palladium"),
  };
}
