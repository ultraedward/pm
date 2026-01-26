// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Defensive: model may not exist or DB may be unavailable
    if (!prisma || !("alertTrigger" in prisma)) {
      return NextResponse.json([]);
    }

    const alerts = await prisma["alertTrigger"].findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(alerts ?? []);
  } catch (error) {
    console.error("GET /api/alerts soft-fail:", error);
    // NEVER 500 in prod for this endpoint
    return NextResponse.json([]);
  }
}