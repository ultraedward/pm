import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { triggeredAt: 'desc' }
  });

  return NextResponse.json(triggers);
}
