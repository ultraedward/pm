import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { metal, targetPrice, direction } = body;

  if (!metal || !targetPrice || !direction) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const alert = await prisma.alert.create({
    data: {
      metal,
      targetPrice: Number(targetPrice),
      direction,
    },
  });

  return NextResponse.json(alert);
}

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.alert.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
