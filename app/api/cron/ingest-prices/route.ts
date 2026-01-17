// app/api/cron/ingest-prices/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * This cron previously ingested into a removed `price` model.
 * It is now a no-op health check to keep the cron endpoint valid.
 */
export async function GET() {
  const alertCount = await prisma.alert.count();

  return NextResponse.json({
    ok: true,
    alertCount,
    ranAt: new Date().toISOString(),
  });
}
