import prisma from "../../lib/prisma.js";

export default async function handler(req, res) {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Attach current spot prices
    const prices = await prisma.spotPriceCache.findMany();
    const priceMap = Object.fromEntries(
      prices.map((p) => [p.metal.toLowerCase(), Number(p.price)])
    );

    const enriched = alerts.map((a) => ({
      ...a,
      currentPrice: priceMap[a.metal.toLowerCase()] ?? null,
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Alerts API error:", error);
    res.status(500).json({ error: "Failed to load alerts" });
  }
}
