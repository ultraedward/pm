import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = [
      { metal: "gold", price: 2350 },
      { metal: "silver", price: 28.5 },
      { metal: "platinum", price: 980 },
    ];

    await prisma.spotPriceCache.createMany({
      data,
      skipDuplicates: true,
    });

    return res.status(200).json({
      ok: true,
      seeded: data,
    });
  } catch (error) {
    console.error("Seed prices error:", error);
    return res.status(500).json({ error: "Failed to seed prices" });
  }
}
