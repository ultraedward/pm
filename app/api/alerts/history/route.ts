import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get('metal');

  /**
   * We only have Alert + AlertTrigger.
   * Price history is derived from AlertTrigger rows.
   */

  const triggers = await prisma.alertTrigger.findMany({
    where: metal
      ? {
          alert: {
            metal,
          },
        }
      : undefined,
    orderBy: {
      triggeredAt: 'desc',
    },
    take: 100,
    select: {
      price: true,
      triggeredAt: true,
      alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  return NextResponse.json(
    triggers.map((t) => ({
      metal: t.alert.metal,
      price: t.price,
      timestamp: t.triggeredAt,
    }))
  );
}