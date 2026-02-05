import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseRange(range: string) {
  const now = new Date();

  switch (range) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal") ?? "gold";
  const range = searchParams.get("range") ?? "7d";

  const since = parseRange(range);

  const prices = await prisma.spotPrice.findMany({
    where: {
      metal,
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      price: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ prices });
}