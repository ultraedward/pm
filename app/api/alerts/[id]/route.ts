import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type PatchBody = {
  active?: boolean;
  cooldownMinutes?: number;
  fireOnce?: boolean;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
    include: {
      triggers: {
        orderBy: { triggeredAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!alert) {
    return NextResponse.json(
      { ok: false, error: 'Alert not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, alert });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await req.json()) as PatchBody;

  const updated = await prisma.alert.update({
    where: { id: params.id },
    data: {
      ...(typeof body.active === 'boolean' && { active: body.active }),
      ...(typeof body.cooldownMinutes === 'number' && {
        cooldownMinutes: body.cooldownMinutes,
      }),
      ...(typeof body.fireOnce === 'boolean' && {
        fireOnce: body.fireOnce,
      }),
    },
  });

  return NextResponse.json({
    ok: true,
    alert: updated,
  });
}