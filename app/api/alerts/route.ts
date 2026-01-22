import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const alerts = await prisma.alert.findMany({
    include: {
      triggers: {
        orderBy: { triggeredAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    alerts.map(a => ({
      id: a.id,
      metal: a.metal,
      direction: a.direction,
      target: a.target,        // ✅ correct field
      active: a.active,
      createdAt: a.createdAt,
      triggers: a.triggers.map(t => ({
        id: t.id,
        price: t.price,
        triggeredAt: t.triggeredAt,
        deliveredAt: t.deliveredAt,
        createdAt: t.createdAt,
      })),
    }))
  );
}