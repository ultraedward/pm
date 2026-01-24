import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
    });

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