// app/api/charts/prices/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");
  const range = searchParams.get("range") ?? "24h";

  if (!metal) {
    return NextResponse.json([]);
  }

  const now = Date.now();
  const since =
    range === "7d"
      ? new Date(now - 7 * 24 * 60 * 60 * 1000)
      : range === "30d"
      ? new Date(now - 30 * 24 * 60 * 60 * 1000)
      : new Date(now - 24 * 60 * 60 * 1000);

  // Use alertTrigger as the time-series source (price model no longer exists)
  const rows = await prisma.alertTrigger.findMany({
    where: {
      Alert: {
        metal,
      },
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      createdAt: true,
      price: true,
    },
  });

  return NextResponse.json(
    rows.map((r) => ({
      t: r.createdAt.getTime(),
      price: r.price,
    }))
  );
}
