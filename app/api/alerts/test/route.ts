// app/api/alerts/test/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertEngine } from "@/lib/alerts/engine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1) Get session (may throw)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Not signed in" },
        { status: 401 }
      );
    }

    // 2) Get latest price
    const latest = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { ok: false, error: "No price data available" },
        { status: 400 }
      );
    }

    // 3) Create guaranteed-trigger alert
    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        metal: latest.metal,
        direction: "ABOVE",
        targetPrice: latest.price - 1,
      },
    });

    // 4) Run engine
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
  } catch (err: any) {
    // 🔴 THIS IS THE KEY PART
    console.error("[alerts/test] failed", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
        detail: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
