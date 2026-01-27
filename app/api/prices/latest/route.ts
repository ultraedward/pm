import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.priceHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    });

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[prices/latest]", err);
    return NextResponse.json(
      { error: "Failed to fetch latest prices" },
      { status: 500 }
    );
  }
}