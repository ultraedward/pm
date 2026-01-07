// app/api/prices/history/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function rangeToDate(range: string) {
  const now = new Date();
  if (range === "7d") now.setDate(now.getDate() - 7);
  else if (range === "30d") now.setDate(now.getDate() - 30);
  else now.setHours(now.getHours() - 24);
  return now;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "24h";

  const since = rangeToDate(range);

  const prices = await prisma.spotPriceCache.findMany({
    where: {
      metal: "gold",
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(prices);
}
