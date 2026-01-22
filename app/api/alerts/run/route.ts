import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  const started = Date.now();

  const lockResult = await runWithAdvisoryLock(
    prisma,
    'cron:alerts-run',
    async () => {
      return await runAlertEngine();
    }
  );

  // 🔒 Another instance is running — exit cleanly
  if (!lockResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'LOCKED',
        ranAt: new Date().toISOString(),
        ms: Date.now() - started,
      },
      { status: 409 }
    );
  }

  const { checked, fired } = lockResult.result;

  return NextResponse.json({
    ok: true,
    checkedAlerts: checked,
    newTriggers: fired,
    ranAt: new Date().toISOString(),
    ms: Date.now() - started,
  });
}