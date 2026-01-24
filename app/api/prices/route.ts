import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      { metal: string; price: number; timestamp: Date }[]
    >`
      SELECT metal, price, timestamp
      FROM "Price"
      ORDER BY timestamp ASC
      LIMIT 500
    `;

    return NextResponse.json({
      ok: true,
      prices: rows ?? [],
    });
  } catch (err) {
    console.error("GET /api/prices error:", err);

    // 🔒 ALWAYS RETURN ARRAY SHAPE
    return NextResponse.json(
      {
        ok: false,
        prices: [],
      },
      { status: 200 }
    );
  }
}