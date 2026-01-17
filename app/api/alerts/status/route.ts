import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lastTrigger = await prisma.alertTrigger.findFirst({
      orderBy: {
        triggeredAt: "desc",
      },
      select: {
        triggeredAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      lastTriggeredAt: lastTrigger?.triggeredAt ?? null,
    });
  } catch (err) {
    console.error("alerts/status error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch alert status" },
      { status: 500 }
    );
  }
}
