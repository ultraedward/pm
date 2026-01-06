import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Runs alert evaluation for all active alerts.
 * This is the REAL alert engine (no email sending yet).
 * Safe to call manually or from cron.
 */
export async function POST() {
  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      include: {
        user: true,
      },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      // Get latest spot price for this metal
      const latestPrice = await prisma.spotPriceCache.findFirst({
        where: { metal: alert.metal },
        orderBy: { createdAt: "desc" },
      });

      if (!latestPrice) continue;

      const price = latestPrice.price;

      const shouldTrigger =
        alert.direction === "above"
          ? price >= alert.threshold
          : price <= alert.threshold;

      if (!shouldTrigger) continue;

      // Prevent duplicate triggers
      const alreadyTriggered = await prisma.alertTrigger.findFirst({
        where: {
          alertId: alert.id,
          triggered: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (alreadyTriggered) continue;

      // Create trigger
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          userId: alert.userId,
          price,
          triggered: true,
        },
      });

      // Log email intent (NO sending yet)
      await prisma.emailLog.create({
        data: {
          userId: alert.userId,
          to: alert.user.email!,
          subject: `Price alert: ${alert.metal}`,
          status: "queued",
        },
      });

      triggeredCount++;
    }

    return NextResponse.json({
      ok: true,
      triggeredCount,
    });
  } catch (err) {
    console.error("Alert runner error:", err);
    return NextResponse.json(
      { error: "Alert runner failed" },
      { status: 500 }
    );
  }
}
