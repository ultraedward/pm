import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (process.env.ALERTS_ENABLED !== "true") {
    return NextResponse.json(
      { ok: false, message: "Alerts temporarily disabled" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { metal, target, direction } = body;

  if (!metal || !target || !direction) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  // ⚠️ TEMP: attach to first user until auth is finalized
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "no_user" },
      { status: 500 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      target: Number(target),
      direction,
      active: true,
    },
  });

  return NextResponse.json({ ok: true, alert });
}