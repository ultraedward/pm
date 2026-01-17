import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    const triggers = await prisma.alertTrigger.findMany({
      where: metal
        ? {
            alert: {
              metal,
            },
          }
        : undefined,
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

    return NextResponse.json({ ok: true, triggers });
  } catch (err) {
    console.error("charts/alerts error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load alert chart data" },
      { status: 500 }
    );
  }
}
