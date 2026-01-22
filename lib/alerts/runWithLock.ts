import { PrismaClient } from '@prisma/client';

type LockResult<T> =
  | { ok: true; result: T }
  | { ok: false; error: 'LOCKED' };

export async function runWithAdvisoryLock<T>(
  prisma: PrismaClient,
  lockKey: string,
  fn: () => Promise<T>
): Promise<LockResult<T>> {
  const [{ locked }] = await prisma.$queryRaw<
    { locked: boolean }[]
  >`SELECT pg_try_advisory_lock(hashtext(${lockKey})) AS locked`;

  if (!locked) {
    return { ok: false, error: 'LOCKED' };
  }

  try {
    const result = await fn();
    return { ok: true, result };
  } finally {
    await prisma.$executeRaw`
      SELECT pg_advisory_unlock(hashtext(${lockKey}))
    `;
  }
}