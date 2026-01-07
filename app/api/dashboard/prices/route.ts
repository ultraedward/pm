import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // Pull latest prices per metal from SpotPriceCache
  const rows = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // group by metal
  const grouped: Record<string, { time: string; price: number }[]> = {};

  for (const row of rows) {
    if (!grouped[row.metal]) grouped[row.metal] = [];
    grouped[row.metal].push({
      time: row.createdAt.toISOString(),
      price: row.price,
    });
  }

  return NextResponse.json({ data: grouped });
}
