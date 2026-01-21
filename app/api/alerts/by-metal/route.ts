export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metal = searchParams.get('metal');

  if (!metal) {
    return Response.json(
      { ok: false, error: 'metal is required' },
      { status: 400 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { metal },
    include: { triggers: true },
  });

  return Response.json({
    ok: true,
    metal,
    count: alerts.length,
    alerts,
  });
}
