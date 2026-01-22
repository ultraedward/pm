import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(triggers);
}