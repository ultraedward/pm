import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(alerts);
}