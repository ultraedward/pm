import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { alert: true },
  });

  return NextResponse.json({ triggers });
}
