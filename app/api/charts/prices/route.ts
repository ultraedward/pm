import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");
  const range = searchParams.get("range") ?? "24h";

  if (!metal) {
    return NextResponse.json({ prices: [], alerts: [] });
  }

  const now = Date.now();
  const since =
    range === "7d"
      ? new Date(now - 7 * 24 * 60 * 60 * 1000)
      : range === "30d"
      ? new Date(now - 30 * 24 * 60 * 60 * 1000)
      : new Date(now - 24 * 60 * 60 * 1000);

  const prices = await prisma.spotPriceCache.findMany({
    where: {
      metal,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: {
      createdAt: true,
      price: true,
    },
  });

  const alerts = await prisma.alert.findMany({
    where: { metal },
    select: {
      price: true,
      direction: true,
    },
  });

  return NextResponse.json({
    prices: prices.map(p => ({
      t: p.createdAt.getTime(),
      price: p.price,
    })),
    alerts,
  });
}
