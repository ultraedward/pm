import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    if (!metal) {
      return NextResponse.json([], { status: 200 });
    }

    /**
     * IMPORTANT:
     * Use ONLY models that exist in prisma.schema
     * We read from AlertTrigger because that IS defined
     */
    const alerts = await prisma.alertTrigger.findMany({
      where: {
        metal,
        triggeredAt: {
          not: null,
        },
      },
      orderBy: {
        triggeredAt: "asc",
      },
      select: {
        id: true,
        metal: true,
        price: true,
        direction: true,
        triggeredAt: true,
      },
    });

    return NextResponse.json(alerts ?? [], { status: 200 });
  } catch (err) {
    console.error("charts/alerts error", err);

    // NEVER throw — frontend must always receive JSON
    return NextResponse.json([], { status: 200 });
  }
}
