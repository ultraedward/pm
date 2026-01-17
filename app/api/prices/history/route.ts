// app/api/prices/history/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 24);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  // Use alertTrigger as historical price source
  const rows = await prisma.alertTrigger.findMany({
    where: {
      createdAt: { gte: since },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      createdAt: true,
      price: true,
      Alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  const grouped: Record<string, { t: number; price: number }[]> = {};

  for (const r of rows) {
    const metal = r.Alert.metal;
    if (!grouped[metal]) grouped[metal] = [];
    grouped[metal].push({
      t: r.createdAt.getTime(),
      price: r.price,
    });
  }

  return NextResponse.json(grouped);
}
