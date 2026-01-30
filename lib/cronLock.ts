import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Attempt to acquire a cron lock.
 * Returns true if lock acquired, false if already locked.
 */
export async function acquireCronLock(
  name: string,
  ttlSeconds = 60
): Promise<boolean> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

  try {
    await prisma.cronLock.create({
      data: {
        name,
        lockedAt: now,
        expiresAt,
      },
    });

    return true;
  } catch (err: any) {
    // Lock already exists → check expiration
    const existing = await prisma.cronLock.findUnique({ where: { name } });

    if (!existing) return false;

    if (existing.expiresAt < now) {
      // Lock expired → steal it
      await prisma.cronLock.update({
        where: { name },
        data: {
          lockedAt: now,
          expiresAt,
        },
      });

      return true;
    }

    return false;
  }
}

/**
 * Release cron lock (best effort).
 */
export async function releaseCronLock(name: string) {
  try {
    await prisma.cronLock.delete({ where: { name } });
  } catch {
    // no-op (lock may already be gone)
  }
}