import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  return NextResponse.json({ prices });
}
