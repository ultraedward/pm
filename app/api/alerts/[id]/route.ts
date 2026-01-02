import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alert = await prisma.alert.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  if (!alert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.alert.update({
    where: { id: alert.id },
    data: { active: !alert.active },
  });

  return NextResponse.json({ alert: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.alert.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ deleted: true });
}
