import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1️⃣ Auth guard
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Fetch alert trigger history
    const history = await prisma.alertTrigger.findMany({
      where: {
        alert: {
          userId: session.user.id,
        },
      },
      orderBy: {
        triggeredAt: "desc",
      },
      take: 50,
      include: {
        alert: {
          select: {
            metal: true,
            target: true,
            direction: true,
          },
        },
      },
    });

    // 3️⃣ Serialize safely
    const result = history.map((h) => ({
      id: h.id,
      alertId: h.alertId,
      metal: h.metal,
      price: h.price,
      target: h.target,
      direction: h.direction,
      triggeredAt: h.triggeredAt.toISOString(),
    }));

    return NextResponse.json({
      ok: true,
      count: result.length,
      history: result,
    });
  } catch (err) {
    console.error("ALERT HISTORY ERROR", err);

    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 }
    );
  }
}