import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Lightweight sanity data so callers don’t break
    const latestPrices = await prisma.spotPrice.findMany({
      distinct: ["metal"],
      orderBy: { createdAt: "desc" },
      select: {
        metal: true,
        price: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      prices: latestPrices,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Dashboard API failed" },
      { status: 500 }
    );
  }
}
