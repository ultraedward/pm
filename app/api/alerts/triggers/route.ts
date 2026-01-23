import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns recent alert trigger activity.
 * Uses raw SQL to avoid Prisma model delegates.
 */
export async function GET() {
  try {
    const triggers = await prisma.$queryRaw<
      Array<{
        id: string;
        alertId: string;
        price: number;
        triggeredAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
      }>
    >`
      SELECT
        id,
        "alertId",
        price,
        "triggeredAt",
        "deliveredAt",
        "createdAt"
      FROM "AlertTrigger"
      ORDER BY "createdAt" DESC
      LIMIT 100
    `;

    return NextResponse.json(triggers);
  } catch (err) {
    console.error("alerts triggers error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}