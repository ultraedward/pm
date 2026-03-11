// deploy trigger

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latestPrices = await prisma.price.findMany({
      orderBy: { timestamp: "desc" },
      take: 10
    });

    const gold = latestPrices.find((p) => p.metal === "gold")?.price ?? null;
    const silver = latestPrices.find((p) => p.metal === "silver")?.price ?? null;

    return NextResponse.json({
      ok: true,
      gold,
      silver,
      source: "database"
    });
  } catch (error: any) {
    const message = error?.message ?? "Unknown server error while loading current prices";

    console.error("Current prices API error:", {
      message,
      stack: error?.stack ?? null
    });

    return NextResponse.json(
      {
        ok: false,
        gold: null,
        silver: null,
        error: "current_prices_query_failed",
        message,
        details: "This route now reads directly from Prisma and no longer depends on the price engine."
      },
      { status: 200 }
    );
  }
}