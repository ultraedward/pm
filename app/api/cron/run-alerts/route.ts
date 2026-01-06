import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Internal cron endpoint
 * Runs active alerts against latest prices
 * Safe for Vercel cron execution
 */
export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      // Raw SQL to avoid Prisma client drift
      const rows = await prisma.$queryRaw<
        { price: number }[]
      >`
        SELECT price
        FROM "Price"
        WHERE metal = ${alert.metal}
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;

      if (!rows || rows.length === 0) continue;

      const price = rows[0].price;

      const shouldTrigger =
        alert.direction === "above"
          ? price >= alert.threshold
          : price <= alert.threshold;

      if (!shouldTrigger) continue;

      const recentTrigger = await prisma.alertTrigger.findFirst({
        where: {
          alertId: alert.id,
          triggered: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (recentTrigger) continue;

      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          userId: alert.userId,
          price,
          triggered: true,
        },
      });

      triggeredCount++;
    }

    return NextResponse.json({
      ok: true,
      alertsChecked: alerts.length,
      triggeredCount,
    });
  } catch (error) {
    console.error("Cron alert runner failed:", error);
    return NextResponse.json(
      { error: "Cron alert runner failed" },
      { status: 500 }
    );
  }
}
