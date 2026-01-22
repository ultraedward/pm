import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const locked = await runWithAdvisoryLock(
    prisma,
    'alerts:cron',
    async () => {
      const started = Date.now();
      const result = await runAlertEngine();

      return {
        ok: true,
        checkedAlerts: result.checked,
        newTriggers: result.fired,
        ranAt: new Date().toISOString(),
        ms: Date.now() - started,
      };
    }
  );

  if (!locked.ok) {
    return NextResponse.json(
      { ok: true, skipped: true, reason: 'locked' },
      { status: 200 }
    );
  }

  return NextResponse.json(locked.result, { status: 200 });
}
