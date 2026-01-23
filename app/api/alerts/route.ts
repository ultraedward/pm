import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * List all alerts with their trigger counts
 */
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        metal: string;
        target: number;
        direction: string;
        active: boolean;
        createdAt: Date;
        triggerCount: number;
      }>
    >`
      SELECT
        a.id,
        a.metal,
        a.target,
        a.direction,
        a.active,
        a."createdAt",
        COUNT(t.id)::int AS "triggerCount"
      FROM "Alert" a
      LEFT JOIN "AlertTrigger" t
        ON t."alertId" = a.id
      GROUP BY a.id
      ORDER BY a."createdAt" DESC
    `;

    return NextResponse.json({ alerts: rows });
  } catch (err) {
    console.error("alerts route error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}