import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");

    const rows = await prisma.$queryRaw<
      {
        id: string;
        metal: string;
        targetPrice: number;
        direction: string;
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
      WHERE (${metal} IS NULL OR metal = ${metal})
      ORDER BY created_at DESC
    `;

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[api/charts/alerts] failed", err);

    // Never break charts rendering
    return NextResponse.json([]);
  }
}