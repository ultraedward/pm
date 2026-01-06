import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * REAL alert execution engine
 * Uses Price table (authoritative source)
 */
export async function POST() {
  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      // Get latest price for this metal
      const latestPrice = await prisma.price.findFirst({
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

      // Create trigger record
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          userId: alert.userId,
          price,
          triggered: true,
        },
      });

      // Log email intent (no sending yet)
      await prisma.emailLog.create({
        data: {
          userId: alert.userId,
          to: alert.userEmail ?? "",
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
  } catch (error) {
    console.error("Alert runner failed:", error);
    return NextResponse.json(
      { error: "Alert runner failed" },
      { status: 500 }
    );
  }
}
