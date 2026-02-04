import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";
import { getLatestPrice } from "@/lib/getLatestPrice";
import { isInCooldown } from "@/lib/alertCooldown";

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: {
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
    },
  });

  let triggered = 0;

  for (const alert of alerts) {
    const price = await getLatestPrice(alert.metal);
    if (price == null) continue;

    const lastTrigger = alert.triggers[0] ?? null;

    if (isInCooldown(alert, lastTrigger)) continue;

    const conditionMet =
      (alert.direction === "above" && price >= alert.price) ||
      (alert.direction === "below" && price <= alert.price);

    if (!conditionMet) continue;

    await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        price,
        triggeredAt: new Date(),
      },
    });

    triggered++;
  }

  return NextResponse.json({
    ok: true,
    alertsChecked: alerts.length,
    triggered,
  });
}