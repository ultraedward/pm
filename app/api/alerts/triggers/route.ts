// app/api/alerts/triggers/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Backwards-compatible endpoint used by older UI code.
 * Same payload as /api/alerts/history.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal") ?? undefined;
  const take = Math.min(Math.max(Number(searchParams.get("take") ?? 100), 1), 500);

  const rows = await prisma.alertTrigger.findMany({
    where: {
      alert: {
        userId: session.user.id,
        ...(metal ? { metal } : {}),
      },
    },
    orderBy: { triggeredAt: "desc" },
    take,
    select: {
      id: true,
      triggeredAt: true,
      price: true,
      alert: {
        select: {
          id: true,
          metal: true,
          direction: true,
          targetPrice: true,
        },
      },
    },
  });

  const out = rows.map((r) => ({
    id: r.id,
    triggeredAt: r.triggeredAt.toISOString(),
    currentPrice: r.price,
    alertId: r.alert.id,
    metal: r.alert.metal,
    direction: r.alert.direction,
    targetPrice: r.alert.targetPrice,
  }));

  return NextResponse.json(out);
}

export async function POST(req: Request) {
  return GET(req);
}
