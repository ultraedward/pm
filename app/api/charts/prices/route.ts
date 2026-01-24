import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns historical price data for charts.
 * Uses raw SQL to avoid removed Prisma delegates.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal"); // optional
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number(daysParam) : 30;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.$queryRaw<
      Array<{
        timestamp: Date;
        metal: string;
        price: number;
      }>
    >`
      SELECT
        "timestamp",
        metal,
        price
      FROM "PriceHistory"
      WHERE "timestamp" >= ${since}
      ${metal ? prisma.$queryRaw`AND metal = ${metal}` : prisma.$queryRaw``}
      ORDER BY "timestamp" ASC
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error("charts prices error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}