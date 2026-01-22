import type { PrismaClient } from '@prisma/client';

// FNV-1a 64-bit -> stable bigint key for Postgres advisory locks
function fnv1a64(input: string): bigint {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * prime) & 0xffffffffffffffffn;
  }
  // advisory locks accept signed bigint; keep it positive-ish
  return hash >= 0x8000000000000000n ? hash - 0x10000000000000000n : hash;
}

export async function runWithAdvisoryLock<T>(
  prisma: PrismaClient,
  lockName: string,
  fn: () => Promise<T>
): Promise<{ ok: true; result: T } | { ok: false; error: 'LOCKED' }> {
  const key = fnv1a64(lockName);

  const rows = await prisma.$queryRaw<Array<{ locked: boolean }>>`
    SELECT pg_try_advisory_lock(${key}) AS locked
  `;

  const locked = rows?.[0]?.locked === true;
  if (!locked) return { ok: false, error: 'LOCKED' };

  try {
    const result = await fn();
    return { ok: true, result };
  } finally {
    // always attempt to unlock
    await prisma.$queryRaw`
      SELECT pg_advisory_unlock(${key})
    `;
  }
}
