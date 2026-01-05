// app/api/alerts/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alert = await prisma.alert.findFirst({
    where: {
      id: params.id,
      user: { email: session.user.email },
    },
  });

  if (!alert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.alert.update({
    where: { id: params.id },
    data: { active: !alert.active },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.alert.deleteMany({
    where: {
      id: params.id,
      user: { email: session.user.email },
    },
  });

  return NextResponse.json({ success: true });
}
