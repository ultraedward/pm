import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const alertId = params.id;

  try {
    // Fetch alert via raw SQL (no Prisma model dependency)
    const alerts = await prisma.$queryRaw<
      Array<{
        id: string;
        userId: string;
        metal: string;
        target: number;
        direction: string;
        active: boolean;
        createdAt: Date;
      }>
    >`
      SELECT
        id,
        "userId",
        metal,
        target,
        direction,
        active,
        "createdAt"
      FROM "Alert"
      WHERE id = ${alertId}
      LIMIT 1
    `;

    if (alerts.length === 0) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    const alert = alerts[0];

    // Fetch triggers separately
    const triggers = await prisma.$queryRaw<
      Array<{
        id: string;
        price: number;
        triggeredAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
      }>
    >`
      SELECT
        id,
        price,
        "triggeredAt",
        "deliveredAt",
        "createdAt"
      FROM "AlertTrigger"
      WHERE "alertId" = ${alertId}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({
      ...alert,
      triggers,
    });
  } catch (error) {
    console.error("GET /api/alerts/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}