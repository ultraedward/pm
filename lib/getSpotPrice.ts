import { prisma } from "@/lib/prisma";

/**
 * Returns the most recent triggered price for a metal.
 * Uses raw SQL because AlertTrigger is not a Prisma model.
 */
export async function getSpotPrice(
  metal: string
): Promise<number | null> {
  const rows = await prisma.$queryRaw<
    { price: number }[]
  >`
    SELECT t.price
    FROM "AlertTrigger" t
    INNER JOIN "Alert" a
      ON a.id = t."alertId"
    WHERE a.metal = ${metal}
    ORDER BY t."triggeredAt" DESC
    LIMIT 1
  `;

  return rows.length > 0 ? rows[0].price : null;
}
