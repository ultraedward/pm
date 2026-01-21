export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(triggers);
}
