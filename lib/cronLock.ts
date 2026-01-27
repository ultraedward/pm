import { prisma } from "@/lib/prisma";

/**
 * Runs a function under a global Postgres advisory lock.
 * If the lock is already held, the function will NOT execute.
 */
export async function withCronLock<T>(
  lockId: number,
  fn: () => Promise<T>
): Promise<{ ran: boolean; result?: T }> {
  const rows = await prisma.$queryRaw<
    { acquired: boolean }[]
  >`SELECT pg_try_advisory_lock(${lockId}) AS acquired`;

  if (!rows[0]?.acquired) {
    return { ran: false };
  }

  try {
    const result = await fn();
    return { ran: true, result };
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(${lockId})`;
  }
}