import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get('metal');

  const where = metal ? { metal } : {};

  const history = await prisma.price.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 100,
  });

  return NextResponse.json({
    ok: true,
    history,
  });
}