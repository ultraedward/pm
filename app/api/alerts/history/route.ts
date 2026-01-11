// app/api/alerts/history/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// FIX: requirePro no longer returns NextResponse or userId

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePro } from "@/lib/requirePro";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Auth check (pro gating disabled)
    await requirePro();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await prisma.alertTrigger.findMany({
      where: { alert: { userId: session.user.id } },
      orderBy: { triggeredAt: "desc" },
      take: 50,
      select: {
        id: true,
        price: true,
        triggeredAt: true,
        alert: {
          select: {
            metal: true,
            direction: true,
            target: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, history });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unable to load alert history" },
      { status: 500 }
    );
  }
}
