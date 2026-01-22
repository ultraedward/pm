import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_TOKEN || '';
  return Boolean(expected) && token === expected;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

const result = await prisma.alertTrigger.updateMany({
  where: {
    triggeredAt: { not: undefined },
    deliveredAt: null,
  },
  data: {
    deliveredAt: new Date(),
  },
});

  return NextResponse.json({ ok: true, backfilled: result.count });
}
