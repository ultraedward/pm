import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") ?? 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const rows = await prisma.alertTrigger.findMany({
      where: {
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

    // Group by metal → [{ t, price }]
    const series: Record<string, { t: number; price: number }[]> = {};

    for (const row of rows) {
      const metal = row.alert.metal;
      if (!series[metal]) series[metal] = [];
      series[metal].push({
        t: row.triggeredAt.getTime(),
        price: row.price,
      });
    }

    return NextResponse.json({
      ok: true,
      series,
    });
  } catch (err) {
    console.error("prices/history error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load price history" },
      { status: 500 }
    );
  }
}
