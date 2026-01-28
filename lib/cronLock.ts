import { prisma } from "@/lib/prisma";

const LOCK_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function acquireCronLock(name: string): Promise<boolean> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOCK_TTL_MS);

  try {
    await prisma.cronLock.create({
      data: {
        name,
        lockedAt: now,
        expiresAt,
      },
    });
    return true;
  } catch {
    const existing = await prisma.cronLock.findUnique({ where: { name } });

    if (!existing || existing.expiresAt < now) {
      await prisma.cronLock.upsert({
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
      return true;
    }

    return false;
  }
}

export async function releaseCronLock(name: string) {
  await prisma.cronLock.deleteMany({
    where: { name },
  });
}