import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      alertTriggerCount,
      priceHistoryCount,
    ] = await Promise.all([
      prisma.alertTrigger.count(),
      prisma.priceHistory.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: {
        alertTriggers: alertTriggerCount,
        priceHistory: priceHistoryCount,
      },
    });
  } catch (err) {
    console.error("[health/deep] failed", err);

    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}