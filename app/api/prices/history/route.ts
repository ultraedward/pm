import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.priceHistory.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 500,
    });

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[prices/history]", err);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}