import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSpotPrice } from "@/lib/getSpotPrice";

export async function GET() {
  const alerts = await prisma.alert.findMany({
    include: {
      triggers: {
        where: {
          triggeredAt: null,
        },
      },
    },
  });

  const results = [];

  for (const alert of alerts) {
    const currentPrice = await getSpotPrice(alert.metal);

    if (currentPrice === null) continue;

    for (const trigger of alert.triggers) {
      let wouldFire = false;

      if (alert.direction === "above" && currentPrice >= alert.targetPrice) {
        wouldFire = true;
      }

      if (alert.direction === "below" && currentPrice <= alert.targetPrice) {
        wouldFire = true;
      }

      results.push({
        alertId: alert.id,
        metal: alert.metal,
        direction: alert.direction,
        targetPrice: alert.targetPrice,
        currentPrice,
        wouldFire,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    count: results.length,
    results,
  });
}
