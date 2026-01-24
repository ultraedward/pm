import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron health check for price ingestion.
 * Does NOT rely on removed Prisma delegates.
 */
export async function GET() {
  try {
    // Simple DB sanity checks using raw SQL
    const [{ count: priceCount }] = await prisma.$queryRaw<
      Array<{ count: number }>
    >`
      SELECT COUNT(*)::int AS count FROM "PriceHistory"
    `;

    const [{ count: triggerCount }] = await prisma.$queryRaw<
      Array<{ count: number }>
    >`
      SELECT COUNT(*)::int AS count FROM "AlertTrigger"
    `;

    return NextResponse.json({
      ok: true,
      priceCount,
      triggerCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("cron ingest-prices error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}