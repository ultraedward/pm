import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    if (!metal) {
      return NextResponse.json(
        { error: "metal is required" },
        { status: 400 }
      );
    }

    // Raw SQL to avoid Prisma model mismatch
    const alerts = await prisma.$queryRaw<
      Array<{
        id: string;
        metal: string;
        direction: string;
        active: boolean;
        createdAt: Date;
        triggerId: string | null;
        price: number | null;
        triggeredAt: Date | null;
      }>
    >`
      SELECT
        a.id,
        a.metal,
        a.direction,
        a.active,
        a."createdAt",
        t.id AS "triggerId",
        t.price,
        t."triggeredAt"
      FROM "Alert" a
      LEFT JOIN "AlertTrigger" t
        ON t."alertId" = a.id
      WHERE a.metal = ${metal}
      ORDER BY a."createdAt" DESC
    `;

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("alerts/by-metal error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}