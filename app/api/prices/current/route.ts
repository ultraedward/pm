// deploy trigger

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [goldRow, silverRow, platinumRow, palladiumRow] = await Promise.all([
      prisma.price.findFirst({ where: { metal: "gold" },      orderBy: { timestamp: "desc" }, select: { price: true } }),
      prisma.price.findFirst({ where: { metal: "silver" },    orderBy: { timestamp: "desc" }, select: { price: true } }),
      prisma.price.findFirst({ where: { metal: "platinum" },  orderBy: { timestamp: "desc" }, select: { price: true } }),
      prisma.price.findFirst({ where: { metal: "palladium" }, orderBy: { timestamp: "desc" }, select: { price: true } }),
    ]);

    return NextResponse.json({
      ok: true,
      gold:      goldRow?.price      ?? null,
      silver:    silverRow?.price    ?? null,
      platinum:  platinumRow?.price  ?? null,
      palladium: palladiumRow?.price ?? null,
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
        platinum: null,
        palladium: null,
        error: "current_prices_query_failed",
        message,
        details: "This route now reads directly from Prisma and no longer depends on the price engine."
      },
      { status: 200 }
    );
  }
}