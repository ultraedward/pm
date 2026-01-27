import { prisma } from "@/lib/prisma";

/**
 * Run a function under a global Postgres advisory lock.
 * If lock is already held, the function will NOT run.
 */
export async function withCronLock<T>(
  lockId: number,
  fn: () => Promise<T>
): Promise<{ ran: boolean; result?: T }> {
  const acquired = await prisma.$queryRaw<
    { acquired: boolean }[]
  >`SELECT pg_try_advisory_lock(${lockId}) AS acquired`;

  if (!acquired[0]?.acquired) {
    return { ran: false };
  }

  try {
    const result = await fn();
    return { ran: true, result };
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(${lockId})`;
  }
}