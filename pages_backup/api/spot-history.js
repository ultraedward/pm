import { prisma } from "../../lib/prisma.js";

export default async function handler(req, res) {
  const metal = String(req.query.metal || "XAU");
  const take = Math.min(Number(req.query.take || 60), 365);

  try {
    const rows = await prisma.priceHistory.findMany({
      where: { metal },
      orderBy: { at: "asc" },
      take
    });

    res.status(200).json(
      rows.map(r => ({
        at: r.at,
        price: r.price
      }))
    );
  } catch {
    res.status(200).json([]);
  }
}
