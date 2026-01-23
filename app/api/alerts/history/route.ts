import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns alert trigger history, optionally filtered by metal
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

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
        t.id              AS "triggerId",
        a.id              AS "alertId",
        a.metal           AS "metal",
        a.direction       AS "direction",
        t.price           AS "price",
        t."triggeredAt"   AS "triggeredAt",
        t."deliveredAt"  AS "deliveredAt",
        t."createdAt"    AS "createdAt"
      FROM "AlertTrigger" t
      INNER JOIN "Alert" a
        ON a.id = t."alertId"
      ${metal ? prisma.$unsafe(`WHERE a.metal = '${metal}'`) : prisma.$unsafe("")}
      ORDER BY t."triggeredAt" DESC
    `;

    return NextResponse.json({ history: rows });
  } catch (err) {
    console.error("alerts/history error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}