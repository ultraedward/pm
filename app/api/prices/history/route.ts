import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal") ?? "Gold";
  const hours = Number(searchParams.get("hours") ?? 48);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const rows = await prisma.priceHistory.findMany({
    where: {
      metal,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    metal,
    points: rows.map((r) => ({
      time: r.createdAt,
      price: r.price,
    })),
  });
}
