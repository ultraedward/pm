import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seen = new Set<string>();
  let deleted = 0;

  for (const t of triggers) {
    const key = `${t.alertId}:${t.price}`;

    if (seen.has(key)) {
      await prisma.alertTrigger.delete({ where: { id: t.id } });
      deleted++;
    } else {
      seen.add(key);
    }
  }

  return NextResponse.json({
    ok: true,
    deleted,
  });
}