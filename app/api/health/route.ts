import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // lightweight DB ping (no model assumptions)
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      db: "reachable",
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json({
      status: "degraded",
      db: "unreachable",
      time: new Date().toISOString()
    });
  }
}