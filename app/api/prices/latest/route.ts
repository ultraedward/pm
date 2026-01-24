import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the latest price per metal.
 * Used for dashboards / summaries.
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

    return NextResponse.json({
      ok: true,
      prices: rows.reduce<Record<string, { price: number; timestamp: number }>>(
        (acc, r) => {
          acc[r.metal] = {
            price: r.price,
            timestamp: r.timestamp.getTime(),
          };
          return acc;
        },
        {}
      ),
    });
  } catch (err) {
    console.error("prices/latest error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}