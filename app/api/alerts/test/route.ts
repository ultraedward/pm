// app/api/alerts/test/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertEngine } from "@/lib/alerts/engine";

export const dynamic = "force-dynamic";

/**
 * Creates a test alert that is guaranteed to trigger
 * and immediately runs the alert engine.
 */
export async function POST() {
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

  // 2) Create alert that will ALWAYS trigger
  // If current price is X:
  // - ABOVE at X - 1
  const alert = await prisma.alert.create({
    data: {
      userId: "test-user",
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
