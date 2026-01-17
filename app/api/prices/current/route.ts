import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.alertTrigger.findMany({
      orderBy: {
        triggeredAt: "desc",
      },
      take: 50,
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

    // Reduce to latest price per metal
    const latestByMetal: Record<string, number> = {};

    for (const row of rows) {
      const metal = row.alert.metal;
      if (latestByMetal[metal] === undefined) {
        latestByMetal[metal] = row.price;
      }
    }

    return NextResponse.json({
      ok: true,
      prices: latestByMetal,
    });
  } catch (err) {
    console.error("prices/current error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load current prices" },
      { status: 500 }
    );
  }
}
