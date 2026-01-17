import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { metal: string } }
) {
  try {
    const metal = params.metal;

    if (!metal) {
      return NextResponse.json(
        { error: "Metal is required" },
        { status: 400 }
      );
    }

    const rows = await prisma.alertTrigger.findMany({
      where: {
        alert: {
          metal: metal,
        },
      },
      include: {
        alert: true,
      },
      orderBy: {
        triggeredAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      count: rows.length,
      rows,
    });
  } catch (err) {
    console.error("alerts/by-metal error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch alerts by metal" },
      { status: 500 }
    );
  }
}
