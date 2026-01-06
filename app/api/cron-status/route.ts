import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const alertCount = await prisma.alert.count();

  return NextResponse.json({
    ok: true,
    alerts: alertCount,
    timestamp: new Date().toISOString(),
  });
}
