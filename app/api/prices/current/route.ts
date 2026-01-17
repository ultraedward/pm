// app/api/prices/current/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // Use alertTrigger as the source of latest prices (price model removed)

  const rows = await prisma.alertTrigger.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
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

  const latestByMetal: Record<string, { t: number; price: number }> = {};

  for (const r of rows) {
    const metal = r.Alert.metal;
    if (!latestByMetal[metal]) {
      latestByMetal[metal] = {
        t: r.createdAt.getTime(),
        price: r.price,
      };
    }
  }

  return NextResponse.json(latestByMetal);
}
