import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  const started = Date.now();

  const result = await runWithAdvisoryLock(
    prisma,
    'cron:alerts-run',
    async () => {
      return await runAlertEngine();
    }
  );

  return NextResponse.json({
    ok: true,
    checkedAlerts: result.checked,
    newTriggers: result.fired,
    ranAt: new Date().toISOString(),
    ms: Date.now() - started,
  });
}