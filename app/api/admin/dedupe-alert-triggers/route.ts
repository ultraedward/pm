import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Deduplicates AlertTrigger rows by (alertId, price, triggeredAt)
 * keeping the earliest created row.
 *
 * Admin-only maintenance endpoint.
 */
export async function POST() {
  try {
    const result = await prisma.$executeRawUnsafe(`
      DELETE FROM "AlertTrigger" a
      USING "AlertTrigger" b
      WHERE a.id > b.id
        AND a."alertId" = b."alertId"
        AND a.price = b.price
        AND a."triggeredAt" = b."triggeredAt"
    `)

    return NextResponse.json({
      ok: true,
      deleted: result,
    })
  } catch (err) {
    console.error("dedupe-alert-triggers error", err)
    return NextResponse.json(
      { ok: false, error: "Dedupe failed" },
      { status: 500 }
    )
  }
}