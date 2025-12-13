import { prisma } from "../../lib/prisma.js";

export default async function handler(req, res) {
  try {
    const prices = await prisma.spotPriceCache.findMany({ orderBy: { metal: "asc" } });
    res.status(200).json(prices);
  } catch {
    res.status(200).json([]);
  }
}
