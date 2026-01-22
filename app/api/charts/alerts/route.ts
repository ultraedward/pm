import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DayPoint = {
  day: string; // YYYY-MM-DD
  fired: number;
  delivered: number;
};

function toDayKey(d: Date): string {
  // Use UTC day to keep it consistent across environments
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req: Request) {
  try {
    const url = (req as any).nextUrl ?? new URL(req.url);
    const daysParam = url.searchParams.get('days');
    const days = Math.max(1, Math.min(365, Number(daysParam || 30) || 30));

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // If triggeredAt is non-nullable in schema, we should NOT filter "not null".
    // We only care about triggers in the time window.
    const triggers = await prisma.alertTrigger.findMany({
      where: {
        triggeredAt: {
          gte: since,
        },
      },
      select: {
        triggeredAt: true,
        deliveredAt: true,
      },
      orderBy: {
        triggeredAt: 'asc',
      },
    });

    const map = new Map<string, DayPoint>();

    for (const t of triggers) {
      const firedDay = toDayKey(t.triggeredAt);
      const existing = map.get(firedDay) || { day: firedDay, fired: 0, delivered: 0 };
      existing.fired += 1;
      map.set(firedDay, existing);

      if (t.deliveredAt) {
        const deliveredDay = toDayKey(t.deliveredAt);
        const existingDelivered =
          map.get(deliveredDay) || { day: deliveredDay, fired: 0, delivered: 0 };
        existingDelivered.delivered += 1;
        map.set(deliveredDay, existingDelivered);
      }
    }

    const series = Array.from(map.values()).sort((a, b) => a.day.localeCompare(b.day));

    return NextResponse.json({
      ok: true,
      days,
      since: since.toISOString(),
      points: series,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}