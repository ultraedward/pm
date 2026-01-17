// app/api/alerts/test/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // Simple smoke test endpoint
  // Confirms DB + Prisma are working without relying on removed models

  const alertCount = await prisma.alert.count();
  const triggerCount = await prisma.alertTrigger.count();

  return NextResponse.json({
    ok: true,
    alertCount,
    triggerCount,
    timestamp: new Date().toISOString(),
  });
}
