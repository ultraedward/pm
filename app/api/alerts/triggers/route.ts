import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    const rows = await prisma.alertTrigger.findMany({
      where: metal
        ? {
            alert: {
              metal,
            },
          }
        : undefined,
      orderBy: {
        triggeredAt: "desc",
      },
      select: {
        id: true,
        triggeredAt: true,
        alert: {
          select: {
            metal: true,
            condition: true,
            threshold: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      rows,
    });
  } catch (err) {
    console.error("alerts/triggers error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch alert triggers" },
      { status: 500 }
    );
  }
}
