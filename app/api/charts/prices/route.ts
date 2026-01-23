import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const prices = await prisma.priceHistory.findMany({
    orderBy: { timestamp: 'asc' },
  });

  return NextResponse.json(prices);
}