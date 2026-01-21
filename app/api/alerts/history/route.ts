export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metal = searchParams.get('metal');

  const where = metal ? { metal } : {};

  const history = await prisma.priceHistory.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 100,
  });

  return Response.json({ ok: true, history });
}
