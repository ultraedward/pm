import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const startedAt = new Date();

  const activeAlerts = await prisma.alert.findMany({
    where: { active: true },
  });

  let checked = 0;
  let triggered = 0;
  const results: any[] = [];

  for (const alert of activeAlerts) {
    checked++;

    const latest = await prisma.spotPriceCache.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      results.push({
        alertId: alert.id,
        status: "no-price",
      });
      continue;
    }

    const conditionMet =
      alert.direction === "above"
        ? latest.price >= alert.threshold
        : latest.price <= alert.threshold;

    if (!conditionMet) {
      results.push({
        alertId: alert.id,
        status: "not-triggered",
        price: latest.price,
      });
      continue;
    }

    triggered++;

    await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        userId: alert.userId,
        price: latest.price,
      },
    });

    results.push({
      alertId: alert.id,
      status: "triggered",
      price: latest.price,
    });
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date(),
    totals: {
      alertsChecked: checked,
      alertsTriggered: triggered,
    },
    results,
  });
}
