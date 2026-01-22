import { prisma } from '@/lib/prisma';

/**
 * Inserts a price snapshot into the system.
 * Prices are stored as AlertTriggers so alerts and spot prices
 * share a single source of truth.
 */
export async function insertPrice(
  metal: string,
  price: number
): Promise<void> {
  // Find all active alerts for this metal
  const alerts = await prisma.alert.findMany({
    where: {
      metal,
      active: true,
    },
    select: {
      id: true,
    },
  });

  // No alerts → no reason to store price
  if (alerts.length === 0) return;

  // Insert one trigger per alert (deduped by unique constraint)
  await prisma.$transaction(
    alerts.map((alert) =>
      prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price,
          triggeredAt: new Date(),
        },
      })
    )
  );
}