import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      {
        id: string;
        metal: string;
        targetPrice: number;
        active: boolean;
        createdAt: Date;
      }[]
    >`
      SELECT id, metal, "targetPrice", active, "createdAt"
      FROM "Alert"
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({
      ok: true,
      alerts: rows ?? [],
    });
  } catch (err) {
    console.error("GET /api/alerts error:", err);

    return NextResponse.json(
      {
        ok: false,
        alerts: [],
      },
      { status: 200 }
    );
  }
}