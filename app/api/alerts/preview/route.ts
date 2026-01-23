import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Preview undelivered alert triggers with their alerts
 */
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        triggerId: string;
        alertId: string;
        metal: string;
        direction: string;
        price: number;
        triggeredAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
      }>
    >`
      SELECT
        t.id            AS "triggerId",
        a.id            AS "alertId",
        a.metal         AS "metal",
        a.direction     AS "direction",
        t.price         AS "price",
        t."triggeredAt" AS "triggeredAt",
        t."deliveredAt" AS "deliveredAt",
        t."createdAt"   AS "createdAt"
      FROM "AlertTrigger" t
      INNER JOIN "Alert" a
        ON a.id = t."alertId"
      WHERE t."deliveredAt" IS NULL
      ORDER BY t."triggeredAt" DESC
      LIMIT 25
    `;

    return NextResponse.json({ triggers: rows });
  } catch (err) {
    console.error("alerts/preview error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}