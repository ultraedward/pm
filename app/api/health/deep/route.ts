import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      alertCount,
      triggerCount,
      priceCount,
    ] = await Promise.all([
      prisma.alert.count(),
      prisma.alertTrigger.count(),
      prisma.priceHistory.count(),
    ]);

    return NextResponse.json({
      ok: true,
      counts: {
        alerts: alertCount,
        alertTriggers: triggerCount,
        priceHistory: priceCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[HEALTH DEEP] error", err);

    return NextResponse.json(
      {
        ok: false,
        error: "schema-or-db-failure",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}