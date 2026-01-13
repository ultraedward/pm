import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const metal = searchParams.get("metal") ?? "gold";
  const range = searchParams.get("range") ?? "24h";

  const now = Date.now();

  const since =
    range === "7d"
      ? new Date(now - 7 * 24 * 60 * 60 * 1000)
      : range === "30d"
      ? new Date(now - 30 * 24 * 60 * 60 * 1000)
      : new Date(now - 24 * 60 * 60 * 1000);

  const prices = await prisma.price.findMany({
    where: {
      metal,
      timestamp: { gte: since },
    },
    orderBy: { timestamp: "asc" },
    select: {
      timestamp: true,
      price: true,
    },
  });

  return NextResponse.json(
    prices.map(p => ({
      t: p.timestamp.getTime(),
      price: p.price,
    }))
  );
}
