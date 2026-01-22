import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOCK_ID = 'check-alerts-cron';
const LOCK_WINDOW_MS = 60_000; // 1 minute

export async function POST() {
  const now = new Date();

  try {
    // 🔒 Check lock
    const existing = await prisma.jobLock.findUnique({
      where: { id: LOCK_ID },
    });

    if (existing && now.getTime() - existing.updatedAt.getTime() < LOCK_WINDOW_MS) {
      return NextResponse.json({
        ok: true,
        ran: false,
        reason: 'locked',
      });
    }

    // 🔐 Acquire / refresh lock
    await prisma.jobLock.upsert({
      where: { id: LOCK_ID },
      update: { updatedAt: now },
      create: { id: LOCK_ID, updatedAt: now },
    });

    // 🔔 Run alert engine
    const alerts = await prisma.alert.findMany({
      include: { triggers: true },
    });

    for (const alert of alerts) {
      const latest = await prisma.priceHistory.findFirst({
        where: { metal: alert.metal },
        orderBy: { timestamp: 'desc' },
      });

      if (!latest) continue;

      const shouldTrigger =
        alert.direction === 'above'
          ? latest.price > alert.targetPrice
          : latest.price < alert.targetPrice;

      if (!shouldTrigger) continue;

      const exists = await prisma.alertTrigger.findFirst({
        where: {
          alertId: alert.id,
          price: latest.price,
          triggeredAt: { not: null },
        },
      });

      if (exists) continue;

      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: latest.price,
          triggeredAt: now,
          deliveredAt: now,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      ran: true,
    });
  } catch (error) {
    console.error('check-alerts error:', error);
    return NextResponse.json(
      { ok: false, error: 'internal_error' },
      { status: 500 }
    );
  }
}