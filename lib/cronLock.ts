import { prisma } from "@/lib/prisma";

const DEFAULT_TTL_MS = 10 * 60 * 1000;

export async function acquireCronLock(
  name: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<boolean> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.cronLock.findUnique({
        where: { name },
      });

      if (existing && existing.expiresAt > now) {
        throw new Error("LOCKED");
      }

      await tx.cronLock.upsert({
        where: { name },
        update: {
          lockedAt: now,
          expiresAt,
        },
        create: {
          name,
          lockedAt: now,
          expiresAt,
        },
      });
    });

    return true;
  } catch {
    return false;
  }
}

export async function releaseCronLock(name: string) {
  await prisma.cronLock
    .delete({
      where: { name },
    })
    .catch(() => {});
}