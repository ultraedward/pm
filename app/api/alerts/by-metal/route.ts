import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get('metal');

    if (!metal) {
      return NextResponse.json(
        { ok: false, error: 'Missing metal parameter' },
        { status: 400 }
      );
    }

    const alerts = await prisma.alert.findMany({
      where: { metal },
      include: {
        triggers: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      ok: true,
      metal,
      count: alerts.length,
      alerts,
    });
  } catch (err) {
    console.error('alerts/by-metal error:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch alerts by metal' },
      { status: 500 }
    );
  }
}
