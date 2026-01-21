import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metal = searchParams.get('metal');

    // ✅ Allow "all metals" instead of 400
    const where = metal ? { metal } : {};

    const prices = await prisma.priceHistory.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json({ ok: true, prices });
  } catch (err) {
    console.error('prices error', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to load prices' },
      { status: 500 }
    );
  }
}
