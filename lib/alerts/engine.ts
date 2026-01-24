import { prisma } from "@/lib/prisma";

export type EngineResult = {
  checkedAlerts: number;
  triggered: number;
};

type AlertRow = {
  id: string;
  metal: string;
  direction: "above" | "below";
  target: number;
};

type PriceRow = {
  metal: string;
  price: number;
};

export async function runAlertEngine(): Promise<EngineResult> {
  // 1️⃣ Load active alerts
  const alerts = await prisma.$queryRaw<AlertRow[]>`
    SELECT
      id,
      metal,
      direction,
      target
    FROM "Alert"
    WHERE active = true
  `;

  if (alerts.length === 0) {
    return { checkedAlerts: 0, triggered: 0 };
  }

  // 2️⃣ Load latest prices (one per metal)
  const prices = await prisma.$queryRaw<PriceRow[]>`
    SELECT DISTINCT ON (metal)
      metal,
      price
    FROM "PriceHistory"
    ORDER BY metal, timestamp DESC
  `;

  const priceMap = new Map(
    prices.map(p => [p.metal, p.price])
  );

  let triggered = 0;

  // 3️⃣ Evaluate alerts
  for (const alert of alerts) {
    const currentPrice = priceMap.get(alert.metal);
    if (currentPrice == null) continue;

    const shouldTrigger =
      alert.direction === "above"
        ? currentPrice >= alert.target
        : currentPrice <= alert.target;

    if (!shouldTrigger) continue;

    // 4️⃣ Record trigger (idempotent per alert+price snapshot)
    await prisma.$executeRaw`
      INSERT INTO "AlertTrigger" (
        "alertId",
        price,
        "triggeredAt",
        "createdAt"
      )
      VALUES (
        ${alert.id},
        ${currentPrice},
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING
    `;

    triggered++;
  }

  return {
    checkedAlerts: alerts.length,
    triggered,
  };
}