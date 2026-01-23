import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Backfills deliveredAt for alert triggers that were fired
 * but never marked delivered.
 *
 * Safe admin-only endpoint.
 */
export async function POST() {
  try {
    const result = await prisma.$executeRawUnsafe(`
      UPDATE "AlertTrigger"
      SET "deliveredAt" = NOW()
      WHERE "deliveredAt" IS NULL
    `)

    return NextResponse.json({
      ok: true,
      updated: result,
    })
  } catch (err) {
    console.error("backfill-delivered error", err)
    return NextResponse.json(
      { ok: false, error: "Backfill failed" },
      { status: 500 }
    )
  }
}