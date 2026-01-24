import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns full price history.
 * Optional ?metal=gold|silver|platinum|palladium
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    const rows = await prisma.$queryRaw<
      Array<{
        metal: string;
        price: number;
        timestamp: Date;
      }>
    >`
      SELECT
        metal,
        price,
        timestamp
      FROM "PriceHistory"
      ${metal ? prisma.$queryRawUnsafe(`WHERE metal = '${metal}'`) : prisma.$queryRaw``}
      ORDER BY timestamp ASC
    `;

    return NextResponse.json({
      ok: true,
      prices: rows.map(r => ({
        metal: r.metal,
        price: r.price,
        timestamp: r.timestamp.getTime(),
      })),
    });
  } catch (err) {
    console.error("prices route error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}