import { NextResponse } from 'next/server';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const dynamic = 'force-dynamic';

async function run() {
  const started = Date.now();

  const lock = await runWithAdvisoryLock('cron:alerts-run', async () => {
    return await runAlertEngine();
  });

  if (!lock.ran) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'Lock not acquired',
      ranAt: new Date().toISOString(),
      ms: Date.now() - started,
    });
  }

  const result = lock.result!;
  return NextResponse.json({
    ok: true,
    checkedAlerts: result.checked,
    newTriggers: result.fired,
    ranAt: new Date().toISOString(),
    ms: Date.now() - started,
  });
}

export async function GET() {
  return run();
}

export async function POST() {
  return run();
}