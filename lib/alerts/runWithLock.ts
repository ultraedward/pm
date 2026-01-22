import { PrismaClient } from '@prisma/client';
import { runAlertEngine } from './engine';

const prisma = new PrismaClient();

const LOCK_ID = 'alert-engine';
const MAX_LOCK_AGE_MS = 5 * 60 * 1000; // 5 minutes

export async function runAlertEngineWithLock() {
  const now = new Date();

  const lock = await prisma.jobLock.findUnique({
    where: { id: LOCK_ID },
  });

  if (lock) {
    const age = now.getTime() - lock.lockedAt.getTime();
    if (age < MAX_LOCK_AGE_MS) {
      return { ok: true, skipped: 'lock-active' };
    }
  }

  await prisma.jobLock.upsert({
    where: { id: LOCK_ID },
    update: { lockedAt: now },
    create: { id: LOCK_ID, lockedAt: now },
  });

  try {
    return await runAlertEngine();
  } finally {
    await prisma.jobLock.delete({ where: { id: LOCK_ID } });
  }
}