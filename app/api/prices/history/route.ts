import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");
  const sinceParam = searchParams.get("since");

  if (!metal || !sinceParam) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const since = new Date(Number(sinceParam));

  const rows = await prisma.alertTrigger.findMany({
    where: {
      alert: {
        metal,
      },
      triggeredAt: {
        gte: since,
      },
    },
    orderBy: {
      triggeredAt: "asc",
    },
    select: {
      triggeredAt: true,
      price: true,
      alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  const series: Record<string, { t: number; price: number | null }[]> = {};

  for (const row of rows) {
    if (!row.triggeredAt) continue; // ✅ FIX: guard null

    const metal = row.alert.metal;
    if (!series[metal]) series[metal] = [];

    series[metal].push({
      t: row.triggeredAt.getTime(),
      price: row.price,
    });
  }

  return NextResponse.json(series);
}
