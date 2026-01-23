import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns high-level alert system status
 */
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        triggeredAt: Date | null;
      }>
    >`
      SELECT
        MAX("triggeredAt") AS "triggeredAt"
      FROM "AlertTrigger"
    `;

    return NextResponse.json({
      ok: true,
      lastTriggerAt: rows[0]?.triggeredAt ?? null,
    });
  } catch (err) {
    console.error("alerts status error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}