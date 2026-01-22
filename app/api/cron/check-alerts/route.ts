export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  // TEMP sanity response — proves route + cron wiring
  return NextResponse.json({
    ok: true,
    job: 'check-alerts',
    timestamp: new Date().toISOString(),
  });
}