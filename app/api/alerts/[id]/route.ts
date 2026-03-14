import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Verify alert belongs to this user
  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true } } },
  });

  if (!alert || alert.user.email !== session.user.email) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await req.json();
  const { active } = body;

  await prisma.alert.update({
    where: { id: params.id },
    data: { active },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Verify alert belongs to this user
  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true } } },
  });

  if (!alert || alert.user.email !== session.user.email) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.alert.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
