import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.$queryRaw<
      {
        id: string;
        metal: string;
        price: number;
        direction: string;
        active: boolean;
        createdAt: Date;
      }[]
    >`
      SELECT
        id,
        metal,
        price,
        direction,
        active,
        "createdAt"
      FROM "Alert"
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({
      ok: true,
      alerts: alerts ?? [],
    });
  } catch (err) {
    console.error("API /alerts error:", err);

    return NextResponse.json(
      {
        ok: false,
        alerts: [],
        error: "Failed to load alerts",
      },
      { status: 500 }
    );
  }
}