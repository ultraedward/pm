import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    ok: true,
    prices,
  });
}
