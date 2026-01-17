import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    const rows = await prisma.alertTrigger.findMany({
      where: {
        ...(metal
          ? {
              alert: {
                metal: metal,
              },
            }
          : {}),
      },
      include: {
        alert: true,
      },
      orderBy: {
        triggeredAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({
      ok: true,
      count: rows.length,
      rows,
    });
  } catch (err) {
    console.error("alerts/history error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch alert history" },
      { status: 500 }
    );
  }
}
