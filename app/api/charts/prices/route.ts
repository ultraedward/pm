import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
    select: {
      id: true,
      metal: true,
      direction: true,
      target: true, // ✅ FIXED (was targetPrice)
      triggers: {
        select: {
          price: true,
          triggeredAt: true,
        },
        orderBy: { triggeredAt: 'desc' },
        take: 1,
      },
    },
  });

  const data = alerts.map(a => ({
    id: a.id,
    metal: a.metal,
    direction: a.direction,
    target: a.target,
    lastTriggeredPrice: a.triggers[0]?.price ?? null,
    lastTriggeredAt: a.triggers[0]?.triggeredAt ?? null,
  }));

  return NextResponse.json({ data });
}