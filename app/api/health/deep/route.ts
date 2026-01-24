import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Simple DB connectivity check — does NOT depend on models
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: "connected",
    });
  } catch (err) {
    console.error("[health/deep] failed", err);

    return NextResponse.json(
      {
        status: "error",
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}