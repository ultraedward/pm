import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight sanity check endpoint.
 * Confirms DB connectivity without using Prisma model delegates.
 */
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        alertCount: bigint;
        triggerCount: bigint;
      }>
    >`
      SELECT
        (SELECT COUNT(*) FROM "Alert")        AS "alertCount",
        (SELECT COUNT(*) FROM "AlertTrigger") AS "triggerCount"
    `;

    return NextResponse.json({
      ok: true,
      alerts: Number(rows[0]?.alertCount ?? 0),
      triggers: Number(rows[0]?.triggerCount ?? 0),
    });
  } catch (err) {
    console.error("alerts test error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}