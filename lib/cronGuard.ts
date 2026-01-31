import { prisma } from "@/lib/prisma";

/**
 * Global cron kill switch.
 * If the row does not exist, cron is ENABLED by default.
 */
export async function isCronEnabled(): Promise<boolean> {
  const row = await prisma.cronControl.findUnique({
    where: { id: 1 },
  });

  if (!row) return true;
  return row.cronEnabled;
}