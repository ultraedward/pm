import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json([], { status: 200 });
  }

  /**
   * Alerts table MUST exist with:
   * - id
   * - metal
   * - targetPrice
   * - createdAt
   *
   * If empty → return []
   */
  const alerts = await prisma.alert.findMany({
    where: { metal },
    select: {
      targetPrice: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    alerts.map((a) => ({
      t: a.createdAt.getTime(),
      price: a.targetPrice,
    }))
  );
}
