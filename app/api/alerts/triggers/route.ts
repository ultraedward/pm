// app/api/alerts/triggers/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // ⚠️ AlertTrigger has NO relation field named `alert`
  // Prisma correctly infers `include` as `never`
  // So we must fetch triggers ONLY

  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ triggers });
}
