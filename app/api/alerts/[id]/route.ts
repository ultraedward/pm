import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
  });

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  return NextResponse.json({ alert });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.alert.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
