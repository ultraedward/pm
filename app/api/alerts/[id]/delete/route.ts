import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();

  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
  });

  if (!alert || alert.userId !== user.id) {
    return new NextResponse("Not found", { status: 404 });
  }

  await prisma.alert.delete({
    where: { id: alert.id },
  });

  return NextResponse.json({ ok: true });
}