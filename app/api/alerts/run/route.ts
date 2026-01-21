export const dynamic = 'force-dynamic';

import { runAlertEngine } from '@/lib/alerts/engine';

export async function POST() {
  try {
    await runAlertEngine();
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error('alerts/run error', e);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
