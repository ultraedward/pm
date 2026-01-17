import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertEngine } from "@/lib/alerts/engine";

export async function POST() {
  const latestPrices: Record<string, number> = {};

  const rows = await prisma.alertTrigger.findMany({
    where: {
      price: { not: null },
    },
    orderBy: {
      triggeredAt: "desc",
    },
    include: {
      alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  for (const row of rows) {
    const metal = row.alert.metal;
    if (latestPrices[metal] === undefined && row.price != null) {
      latestPrices[metal] = row.price;
    }
  }

  await runAlertEngine(latestPrices);

  return NextResponse.json({ ok: true });
}
