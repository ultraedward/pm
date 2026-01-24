import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.alertTrigger.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(alerts);
  } catch (err) {
    console.error("GET /api/alerts failed:", err);
    return NextResponse.json([], { status: 500 });
  }
}