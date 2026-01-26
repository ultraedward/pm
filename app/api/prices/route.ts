// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Defensive guard: model may not exist or DB may be unavailable
    if (!prisma || !("priceHistory" in prisma)) {
      return NextResponse.json([]);
    }

    const prices = await prisma["priceHistory"].findMany({
      orderBy: { timestamp: "asc" },
      take: 500
    });

    return NextResponse.json(prices ?? []);
  } catch (error) {
    console.error("GET /api/prices soft-fail:", error);
    // NEVER 500 in prod
    return NextResponse.json([]);
  }
}