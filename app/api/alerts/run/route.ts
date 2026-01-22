import { runAlertEngineWithLock } from '@/lib/alerts/runWithLock';

export async function POST() {
  try {
    const result = await runAlertEngineWithLock();
    return Response.json(result);
  } catch (err) {
    console.error('alert engine failed', err);
    return Response.json({ ok: false }, { status: 500 });
  }
}