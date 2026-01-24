import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the most recent price per metal.
 * Uses raw SQL only — no Prisma model delegates.
 */
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        metal: string;
        price: number;
        timestamp: Date;
      }>
    >`
      SELECT DISTINCT ON (metal)
        metal,
        price,
        timestamp
      FROM "PriceHistory"
      ORDER BY metal, timestamp DESC
    `;

    const result = rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.metal] = row.price;
      return acc;
    }, {});

    return NextResponse.json({
      ok: true,
      prices: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("prices/current error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}