import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns historical prices for a given metal since a timestamp.
 * Query params:
 *  - metal (string, required)
 *  - since (ms timestamp, optional)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");
    const sinceParam = searchParams.get("since");

    if (!metal) {
      return NextResponse.json(
        { ok: false, error: "metal is required" },
        { status: 400 }
      );
    }

    const since = sinceParam
      ? new Date(Number(sinceParam))
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // default: 30 days

    const rows = await prisma.$queryRaw<
      Array<{
        price: number;
        timestamp: Date;
      }>
    >`
      SELECT
        price,
        timestamp
      FROM "PriceHistory"
      WHERE metal = ${metal}
        AND timestamp >= ${since}
      ORDER BY timestamp ASC
    `;

    return NextResponse.json({
      ok: true,
      metal,
      points: rows.map((r) => ({
        t: r.timestamp.getTime(),
        price: r.price,
      })),
    });
  } catch (err) {
    console.error("prices/history error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}