import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const latest = await prisma.alertTrigger.findMany({
      orderBy: { triggeredAt: 'desc' },
      take: 10,
      include: {
        alert: {
          select: {
            metal: true,
          },
        },
      },
    });

    const byMetal: Record<string, number> = {};

    for (const t of latest) {
      if (!byMetal[t.alert.metal]) {
        byMetal[t.alert.metal] = t.price;
      }
    }

    return NextResponse.json({
      ok: true,
      prices: byMetal,
      at: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: 'FAILED_TO_LOAD_PRICES' },
      { status: 500 }
    );
  }
}