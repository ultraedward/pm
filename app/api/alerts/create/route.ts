import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/requirePro";

export async function POST(req: Request) {
  const gate = await requirePro();
  if (gate instanceof NextResponse) return gate;
  const userId = gate.userId;

  const body = await req.json();
  const { metal, direction, target } = body;

  if (!metal || !direction || !target) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const alert = await prisma.alert.create({
    data: {
      userId,
      metal,
      direction,
      target,
    },
  });

  return NextResponse.json({ ok: true, alert });
}
