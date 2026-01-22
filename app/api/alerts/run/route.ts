import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const lock = await runWithAdvisoryLock(prisma, 'alerts:run', async () => {
    const started = Date.now();
    const result = await runAlertEngine();

    return {
      ok: true,
      checkedAlerts: result.checkedAlerts ?? result.checked ?? 0,
      newTriggers: result.newTriggers ?? result.triggersCreated ?? 0,
      ranAt: new Date().toISOString(),
      ms: Date.now() - started,
    };
  });

  if (!lock.ok) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'locked' }, { status: 200 });
  }

  return NextResponse.json(lock.result, { status: 200 });
}
