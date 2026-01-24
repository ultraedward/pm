import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Inserts a spot price for a given metal.
 * 
 * IMPORTANT:
 * - This function ONLY writes price data.
 * - Alert evaluation is handled elsewhere (alerts engine / cron).
 * - Do NOT add alert logic back into this file.
 */
export async function insertPrice(
  metal: string,
  price: number,
  source: string
): Promise<void> {
  if (!metal || typeof price !== "number") {
    throw new Error("insertPrice: invalid arguments");
  }

  await prisma.$executeRaw`
    INSERT INTO "Price" (
      metal,
      price,
      source,
      timestamp,
      createdAt
    )
    VALUES (
      ${metal},
      ${price},
      ${source},
      NOW(),
      NOW()
    )
  `;
}