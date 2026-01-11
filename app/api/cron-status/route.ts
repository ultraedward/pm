// app/api/cron-status/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const runs = await prisma.cronRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ ok: true, runs });
}
