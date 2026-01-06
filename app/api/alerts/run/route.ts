import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Alert execution engine
 * Uses raw SQL to avoid Prisma client model mismatches
 */
export async function POST() {
  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      // 🔒 Raw SQL fetch of latest price (safe, read-only)
      const result = await prisma.$queryRaw<
        { price: number }[]
      >`
        SELECT price
        FROM "Price"
        WHERE metal = ${alert.metal}
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;

      if (!result || result.length === 0) continue;

      const price = result[0].price;

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
