import { prisma } from '@/lib/prisma';

type LockedResult<T> =
  | { ok: true; result: T }
  | { ok: false; error: 'LOCKED' };

export async function runWithAdvisoryLock<T>(
  lockKey: string,
  timeoutMs: number,
  fn: () => Promise<T>
): Promise<LockedResult<T>> {
  const hash = hashStringToInt(lockKey);

  // try to acquire lock
  const acquired = await prisma.$queryRaw<
    { pg_try_advisory_lock: boolean }[]
  >`SELECT pg_try_advisory_lock(${hash})`;

  if (!acquired[0]?.pg_try_advisory_lock) {
    return { ok: false, error: 'LOCKED' };
  }

  try {
    const result = await fn();
    return { ok: true, result };
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(${hash})`;
  }
}

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}