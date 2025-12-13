import { prisma } from "../../lib/prisma.js";

export default async function handler(req, res) {
  try {
    const rows = await prisma.spotPriceCache.findMany();
    if (!rows.length) return res.status(200).json({ ok: true, inserted: 0 });

    await prisma.priceHistory.createMany({
      data: rows.map(r => ({ metal: r.metal, price: r.price }))
    });

    res.status(200).json({ ok: true, inserted: rows.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
