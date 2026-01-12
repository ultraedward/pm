import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const rows = await prisma.price.findMany({
    orderBy: { timestamp: "desc" },
    take: 20,
  });

  const latest: Record<string, number> = {};
  for (const r of rows) {
    if (!(r.metal in latest)) latest[r.metal] = r.price;
  }

  return NextResponse.json({
    source: "db",
    prices: latest,
    updatedAt: rows[0]?.timestamp ?? null,
  });
}
