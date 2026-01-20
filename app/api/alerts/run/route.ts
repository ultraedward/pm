import { runAlertEngine } from '@/lib/alerts/engine';

export async function POST() {
  await runAlertEngine();
  return Response.json({ ok: true });
}
