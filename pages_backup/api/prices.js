import prisma from "../../lib/prisma.js";
import ensureSpotPrices from "../../lib/ensureSpotPrices.js";

export default async function handler(req, res) {
  try {
    await ensureSpotPrices();

    const prices = await prisma.spotPriceCache.findMany({
      orderBy: { metal: "asc" },
    });

    res.status(200).json(
      prices.map((p) => ({
        metal: p.metal,
        price: Number(p.price),
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Prices API error:", error);
    res.status(500).json({ error: "Failed to load prices" });
  }
}
