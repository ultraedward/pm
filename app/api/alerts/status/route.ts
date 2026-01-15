// app/api/alerts/status/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const lastTrigger = await prisma.alertTrigger.findFirst({
    orderBy: { triggeredAt: "desc" },
    select: { triggeredAt: true },
  });

  const totalAlerts = await prisma.alert.count({
    where: { userId: session.user.id },
  });

  const totalTriggers = await prisma.alertTrigger.count({
    where: { alert: { userId: session.user.id } },
  });

  return NextResponse.json({
    ok: true,
    lastTriggeredAt: lastTrigger?.triggeredAt ?? null,
    totalAlerts,
    totalTriggers,
  });
}
