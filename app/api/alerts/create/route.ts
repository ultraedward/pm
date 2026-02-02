import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOOTSTRAP_EMAIL = process.env.BOOTSTRAP_USER_EMAIL || "admin@local.dev";

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

  // ✅ Ensure a user ALWAYS exists
  const user = await prisma.user.upsert({
    where: { email: BOOTSTRAP_EMAIL },
    update: {},
    create: {
      email: BOOTSTRAP_EMAIL,
    },
  });

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