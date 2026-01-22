export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Cron: checks alerts against latest prices
 * - Deduplicates triggers
 * - Marks deliveredAt immediately
 * - Safe to run repeatedly
 */
export async function POST() {
  try {
    // 1️⃣ Load active alerts
    const alerts = await prisma.alert.findMany({
      include: {
        triggers: true,
      },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      // 2️⃣ Get latest price for metal
      const latest = await prisma.priceHistory.findFirst({
        where: { metal: alert.metal },
        orderBy: { timestamp: 'desc' },
      });

      if (!latest) continue;

      const shouldTrigger =
        alert.direction === 'above'
          ? latest.price >= alert.targetPrice
          : latest.price <= alert.targetPrice;

      if (!shouldTrigger) continue;

      // 3️⃣ Deduplication check
      const alreadyTriggered = alert.triggers.some(
        (t) => t.price === latest.price
      );

      if (alreadyTriggered) continue;

      // 4️⃣ Create trigger + mark delivered
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: latest.price,
          triggeredAt: new Date(),
          deliveredAt: new Date(), // webhook/email later
        },
      });

      triggeredCount++;
    }

    return NextResponse.json({
      ok: true,
      checkedAlerts: alerts.length,
      newTriggers: triggeredCount,
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('check-alerts cron error:', err);
    return NextResponse.json(
      { ok: false, error: 'Cron failed' },
      { status: 500 }
    );
  }
}