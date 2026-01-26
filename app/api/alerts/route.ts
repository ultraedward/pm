// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Runtime-safe: Prisma will resolve this at execution time
    const alerts = await prisma["alertTrigger"].findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("GET /api/alerts failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}