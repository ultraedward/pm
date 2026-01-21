import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  const result = await prisma.alertTrigger.updateMany({
    where: {
      triggeredAt: { not: null },
      deliveredAt: null,
    },
    data: {
      deliveredAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    backfilled: result.count,
  });
}
