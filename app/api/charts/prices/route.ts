import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    if (!metal) {
      return NextResponse.json(
        { ok: false, error: "metal is required" },
        { status: 400 }
      );
    }

    const rows = await prisma.alertTrigger.findMany({
      where: {
        alert: {
          metal,
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
            direction: true,
            targetPrice: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, rows });
  } catch (err) {
    console.error("charts/prices error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load price chart data" },
      { status: 500 }
    );
  }
}
