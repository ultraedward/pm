import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getBearerToken(req: Request): string | null {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) return null;

  const [type, token] = header.split(' ');
  if (type?.toLowerCase() !== 'bearer') return null;
  if (!token) return null;

  return token.trim();
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    const expected = process.env.ADMIN_TOKEN || process.env.ADMIN_BEARER_TOKEN;

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: 'Server missing ADMIN_TOKEN (or ADMIN_BEARER_TOKEN)' },
        { status: 500 }
      );
    }

    if (!token || token !== expected) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // If triggeredAt is non-nullable in schema, it’s always present, so no need to filter on it.
    const result = await prisma.alertTrigger.updateMany({
      where: {
        deliveredAt: null,
      },
      data: {
        deliveredAt: now,
      },
    });

    return NextResponse.json({
      ok: true,
      backfilled: result.count,
      deliveredAt: now.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}