import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const authHeader =
    req.headers.get('authorization') ||
    req.headers.get('Authorization');

  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'ADMIN_SECRET not configured on server' },
      { status: 500 }
    );
  }

  if (!authHeader) {
    return NextResponse.json(
      { ok: false, error: 'Missing Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const result = await prisma.priceHistory.deleteMany({
    where: {
      OR: [
        { price: { lt: 1 } },
        { price: { gt: 10000 } },
      ],
    },
  });

  return NextResponse.json({
    ok: true,
    deleted: result.count,
  });
}