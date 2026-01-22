import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.alertTrigger.findMany({
    where: {
      triggeredAt: {
        not: undefined,
      },
    },
    orderBy: {
      triggeredAt: 'asc',
    },
    select: {
      triggeredAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    points: data.map((d) => ({
      t: d.triggeredAt,
      count: 1,
    })),
  });
}