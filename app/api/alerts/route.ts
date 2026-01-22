import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      triggers: {
        orderBy: { triggeredAt: 'desc' },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    ok: true,
    count: alerts.length,
    alerts: alerts.map((a) => ({
      id: a.id,
      metal: a.metal,
      direction: a.direction,
      targetPrice: a.targetPrice,
      active: a.active,
      fireOnce: a.fireOnce,
      cooldownMinutes: a.cooldownMinutes,
      lastTriggeredAt: a.lastTriggeredAt,
      lastTrigger: a.triggers[0] ?? null,
      createdAt: a.createdAt,
    })),
  });
}