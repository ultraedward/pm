import { prisma } from "@/lib/prisma";

/**
 * Marks an alert trigger as delivered.
 * Uses raw SQL because alertTrigger is not a Prisma model.
 */
export async function notifyTrigger(triggerId: string) {
  await prisma.$executeRawUnsafe(
    `
    UPDATE "AlertTrigger"
    SET "deliveredAt" = NOW()
    WHERE id = $1
    `,
    triggerId
  );
}