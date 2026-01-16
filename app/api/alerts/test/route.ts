// app/api/alerts/test/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertEngine } from "@/lib/alerts/engine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Creates a test alert that is guaranteed to trigger
 * for the currently logged-in user.
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Not signed in" },
      { status: 401 }
    );
  }

  // 1) Get latest price
  const latest = await prisma.price.findFirst({
    orderBy: { timestamp: "desc" },
  });

  if (!latest) {
    return NextResponse.json(
      { ok: false, error: "No price data available" },
      { status: 400 }
    );
  }

  // 2) Create alert guaranteed to trigger
  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal: latest.metal,
      direction: "ABOVE",
      targetPrice: latest.price - 1,
    },
  });

  // 3) Run engine immediately
  const run = await runAlertEngine("manual");

  return NextResponse.json({
    ok: true,
    createdAlert: {
      id: alert.id,
      metal: alert.metal,
      targetPrice: alert.targetPrice,
    },
    engineResult: run,
  });
}
