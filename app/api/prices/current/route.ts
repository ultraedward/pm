import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.alertTrigger.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      price: true,
      alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  const latestByMetal: Record<string, number> = {};

  for (const row of rows) {
    if (row.price === null) continue; // ✅ FIX: guard nulls

    const metal = row.alert.metal;

    if (latestByMetal[metal] === undefined) {
      latestByMetal[metal] = row.price;
    }
  }

  return NextResponse.json(latestByMetal);
}
