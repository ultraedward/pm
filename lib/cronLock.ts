import prisma from "@/lib/prisma";

export async function acquireCronLock(name: string, ttlSeconds = 300) {
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
  } catch {
    const existing = await prisma.cronLock.findUnique({ where: { name } });
    if (!existing || existing.expiresAt < now) {
      await prisma.cronLock.upsert({
        where: { name },
        update: { lockedAt: now, expiresAt },
        create: { name, lockedAt: now, expiresAt },
      });
      return true;
    }
    return false;
  }
}

export async function releaseCronLock(name: string) {
  await prisma.cronLock.delete({ where: { name } }).catch(() => {});
}