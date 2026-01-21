export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    where: { deliveredAt: null },
    include: { alert: true },
  });

  return Response.json({
    ok: true,
    count: triggers.length,
    results: triggers,
  });
}
