import prisma from "../../../lib/prisma.js";
import runAlertsChecker from "../../../lib/alertsChecker.js";

export default async function handler(req, res) {
  try {
    // 1. Fetch current spot prices
    const prices = await prisma.spotPriceCache.findMany();

    // 2. Update prices (simulate movement)
    for (const row of prices) {
      const deltaPercent = (Math.random() - 0.5) * 0.01; // ±0.5%
      const newPrice = Number((row.price * (1 + deltaPercent)).toFixed(2));

      await prisma.spotPriceCache.update({
        where: { id: row.id },
        data: { price: newPrice },
      });
    }

    // 3. Run alerts AFTER prices change
    await runAlertsChecker();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("auto-move-prices error:", error);
    res.status(500).json({ error: "Failed to auto-move prices" });
  }
}
