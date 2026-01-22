import { prisma } from '@/lib/prisma';

// Two-key advisory lock (int32,int32) derived from a string name.
function hash32(input: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Convert to signed int32
  return h | 0;
}

export async function runWithAdvisoryLock<T>(
  lockName: string,
  fn: () => Promise<T>
): Promise<{ ran: boolean; result?: T }> {
  const key1 = hash32(lockName);
  const key2 = hash32(lockName + ':v1');

  // pg_try_advisory_lock(int,int) returns boolean
  const rows = await prisma.$queryRaw<Array<{ locked: boolean }>>`
    SELECT pg_try_advisory_lock(${key1}, ${key2}) AS locked
  `;

  const locked = rows?.[0]?.locked === true;
  if (!locked) return { ran: false };

  try {
    const result = await fn();
    return { ran: true, result };
  } finally {
    await prisma.$queryRaw`
      SELECT pg_advisory_unlock(${key1}, ${key2})
    `;
  }
}