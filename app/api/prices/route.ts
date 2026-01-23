export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metal = searchParams.get('metal');

  const prices = await prisma.priceHistory.findMany({
    where: metal ? { metal } : {},
    orderBy: { timestamp: 'asc' },
  });

  return NextResponse.json(prices);
}