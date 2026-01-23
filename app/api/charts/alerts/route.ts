import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns alert trigger counts grouped by day for charts.
 * Uses raw SQL to avoid removed Prisma delegates.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number(daysParam) : 30;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.$queryRaw<
      Array<{
        day: string;
        count: number;
      }>
    >`
      SELECT
        DATE("triggeredAt") AS day,
        COUNT(*)::int AS count
      FROM "AlertTrigger"
      WHERE "triggeredAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error("charts alerts error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}