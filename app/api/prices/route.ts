// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const prices = await prisma["priceHistory"].findMany({
      orderBy: { timestamp: "asc" },
      take: 500
    });

    return NextResponse.json(prices);
  } catch (error) {
    console.error("GET /api/prices failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}