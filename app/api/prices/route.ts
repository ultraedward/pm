import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prices = await prisma.priceHistory.findMany({
      orderBy: { timestamp: "asc" },
      take: 500,
    });

    return NextResponse.json({
      ok: true,
      prices: prices ?? [],
    });
  } catch (err) {
    console.error("API /prices error:", err);

    return NextResponse.json(
      {
        ok: false,
        prices: [],
        error: "Failed to load prices",
      },
      { status: 500 }
    );
  }
}