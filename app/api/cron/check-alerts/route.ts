import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/sendAlertEmail";

export const runtime = "nodejs";

const COOLDOWN_MINUTES = 30;

export async function GET() {
  try {
    const prices = await prisma.spotPriceCache.findMany({
      distinct: ["metal"],
      orderBy: { createdAt: "desc" },
    });

    const priceMap = Object.fromEntries(
      prices.map((p) => [p.metal, Number(p.price)])
    );

    const alerts = await prisma.alert.findMany({
      include: {
        alertTriggers: {
          orderBy: { triggeredAt: "desc" },
          take: 1,
        },
        user: true,
      },
    });

    const now = Date.now();
    let fired = 0;

    for (const alert of alerts) {
      const currentPrice = priceMap[alert.metal];
      if (!currentPrice) continue;

      const lastTrigger = alert.alertTriggers[0];

      if (lastTrigger) {
        const minutesSince =
          (now - lastTrigger.triggeredAt.getTime()) / 60000;
        if (minutesSince < COOLDOWN_MINUTES) continue;
      }

      const target = Number(alert.target);

      const shouldFire =
        (alert.direction === "above" && currentPrice >= target) ||
        (alert.direction === "below" && currentPrice <= target);

      if (!shouldFire) continue;

      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: currentPrice,
        },
      });

      await sendAlertEmail({
        to: alert.user.email!,
        metal: alert.metal,
        direction: alert.direction,
        target,
        currentPrice,
      });

      fired++;
    }

    return NextResponse.json({
      ok: true,
      alertsChecked: alerts.length,
      alertsFired: fired,
      cooldownMinutes: COOLDOWN_MINUTES,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Cron failed", details: err.message },
      { status: 500 }
    );
  }
}
