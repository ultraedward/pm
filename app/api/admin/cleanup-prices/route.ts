import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');

  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await prisma.priceHistory.deleteMany({
      where: {
        OR: [
          { price: { lt: 1 } },
          { price: { gt: 20000 } },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      deleted: result.count,
    });
  } catch (err) {
    console.error('cleanup error', err);
    return NextResponse.json(
      { ok: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}