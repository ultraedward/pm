// app/api/export/prices/route.ts
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

    // Uses EXISTING model: SpotPriceCache
    const prices = await prisma.spotPriceCache.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        metal: true,
        price: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      prices,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unable to export prices" },
      { status: 500 }
    );
  }
}
