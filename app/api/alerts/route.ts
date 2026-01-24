import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      {
        id: string;
        metal: string;
        targetPrice: number;
        direction: "above" | "below";
        createdAt: Date;
      }[]
    >`
      SELECT
        id,
        metal,
        target_price AS "targetPrice",
        direction,
        created_at AS "createdAt"
      FROM alerts
      ORDER BY created_at DESC
    `;

    // ALWAYS return an array
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[api/alerts] failed", err);

    // NEVER break the UI
    return NextResponse.json([]);
  }
}