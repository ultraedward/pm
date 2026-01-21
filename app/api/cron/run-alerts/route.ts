export const dynamic = 'force-dynamic';

import { runAlertEngine } from '@/lib/alerts/engine';

export async function GET() {
  try {
    await runAlertEngine();
    return Response.json({ ok: true, ranAt: new Date().toISOString() });
  } catch (e: any) {
    console.error('cron/run-alerts error', e);
    return Response.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}
