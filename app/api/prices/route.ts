import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prices = await prisma.priceHistory.findMany({
      orderBy: { timestamp: "asc" },
      take: 500,
    });

    return NextResponse.json(prices);
  } catch (err) {
    console.error("GET /api/prices failed:", err);
    return NextResponse.json([], { status: 500 });
  }
}