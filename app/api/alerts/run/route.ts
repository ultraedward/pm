import { NextResponse } from 'next/server';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export async function POST() {
  const started = Date.now();

  const locked = await runWithAdvisoryLock(
    'cron:alerts-run',
    30_000,
    async () => {
      return await runAlertEngine();
    }
  );

  if (!locked.ok) {
    return NextResponse.json(
      { ok: false, error: 'LOCKED' },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    checkedAlerts: locked.result.checked,
    newTriggers: locked.result.fired,
    ranAt: new Date().toISOString(),
    ms: Date.now() - started,
  });
}