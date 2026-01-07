import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await prisma.spotPriceCache.findMany({
    orderBy: { timestamp: "desc" },
    distinct: ["metal"],
  });

  return NextResponse.json(prices);
}
