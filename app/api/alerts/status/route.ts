// app/api/alerts/status/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const lastTrigger = await prisma.alertTrigger.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  const status = await prisma.alertSystemStatus.upsert({
    where: { id: 1 },
    update: {
      lastTriggeredAt: lastTrigger?.createdAt ?? null,
    },
    create: {
      id: 1,
      lastTriggeredAt: lastTrigger?.createdAt ?? null,
    },
  });

  return NextResponse.json({
    lastTriggeredAt: status.lastTriggeredAt,
  });
}
