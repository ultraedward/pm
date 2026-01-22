import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const latest = await prisma.priceHistory.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1,
    });

    return NextResponse.json({
      ok: true,
      price: latest[0] ?? null,
    });
  } catch (error) {
    console.error('prices/latest error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch latest price' },
      { status: 500 }
    );
  }
}