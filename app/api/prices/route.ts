import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      {
        metal: string;
        price: number;
        timestamp: Date;
      }[]
    >`
      SELECT metal, price, timestamp
      FROM "Price"
      ORDER BY timestamp ASC
      LIMIT 500
    `;

    return NextResponse.json({
      ok: true,
      prices: rows,
    });
  } catch (err) {
    console.error("GET /api/prices failed:", err);

    return NextResponse.json(
      { ok: false, error: "Failed to load prices" },
      { status: 500 }
    );
  }
}