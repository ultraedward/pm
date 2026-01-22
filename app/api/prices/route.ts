import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metal = searchParams.get('metal');

    const triggers = await prisma.alertTrigger.findMany({
      where: metal
        ? {
            alert: {
              metal,
            },
          }
        : undefined,
      orderBy: {
        triggeredAt: 'asc',
      },
      include: {
        alert: {
          select: {
            metal: true,
          },
        },
      },
    });

    const series = triggers.map(t => ({
      metal: t.alert.metal,
      price: t.price,
      at: t.triggeredAt,
    }));

    return NextResponse.json({
      ok: true,
      series,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: 'FAILED_TO_LOAD_PRICES' },
      { status: 500 }
    );
  }
}