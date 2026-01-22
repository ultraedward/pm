cat > app/api/cron/check-alerts/route.ts <<'EOF'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runWithAdvisoryLock } from '@/lib/alerts/runWithLock';
import { runAlertEngine } from '@/lib/alerts/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const locked = await runWithAdvisoryLock(prisma, 'cron:check-alerts', async () => {
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

  if (!locked.ok) {
    return NextResponse.json(
      { ok: true, skipped: true, reason: 'locked', ranAt: new Date().toISOString() },
      { status: 200 }
    );
  }

  return NextResponse.json(locked.result, { status: 200 });
}
EOF