import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Disable an alert by ID
 */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.$executeRawUnsafe(`
      UPDATE "Alert"
      SET active = false
      WHERE id = $1
    `, params.id)

    if (result === 0) {
      return NextResponse.json(
        { ok: false, error: "Alert not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("disable alert error", err)
    return NextResponse.json(
      { ok: false, error: "Disable failed" },
      { status: 500 }
    )
  }
}