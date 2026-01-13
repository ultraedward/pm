import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "Missing metal" },
      { status: 400 }
    );
  }

  const alerts = await prisma.$queryRaw<
    {
      id: string;
      metal: string;
      price: number;
      direction: string;
      triggered_at: Date;
    }[]
  >`
    SELECT
      id,
      metal,
      price,
      direction,
      triggered_at
    FROM alert_triggers
    WHERE metal = ${metal}
    ORDER BY triggered_at ASC
  `;

  return NextResponse.json(
    alerts.map(a => ({
      id: a.id,
      price: a.price,
      direction: a.direction,
      triggeredAt: a.triggered_at,
    }))
  );
}
