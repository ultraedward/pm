import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const alert = await prisma.alert.update({
    where: { id: params.id },
    data: { active: false },
  });

  return NextResponse.json({
    ok: true,
    alert,
  });
}