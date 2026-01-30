import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

const CRON_NAME = "check-alerts";

export async function GET() {
  const locked = await acquireCronLock(CRON_NAME);
  if (!locked) {
    return NextResponse.json({ skipped: "lock-held" });
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    for (const alert of alerts) {
      const latest = await prisma.priceHistory.findFirst({
        where: { metal: alert.metal },
        orderBy: { createdAt: "desc" },
      });

      if (!latest) continue;

      const shouldTrigger =
        alert.direction === "above"
          ? latest.price >= alert.target
          : latest.price <= alert.target;

      if (!shouldTrigger) continue;

      // HARD GUARANTEE: trigger once
      const alreadyTriggered = await prisma.alertTrigger.findFirst({
        where: { alertId: alert.id },
      });

      if (alreadyTriggered) continue;

      await prisma.$transaction([
        prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            metal: alert.metal,
            price: latest.price,
          },
        }),
        prisma.alert.update({
          where: { id: alert.id },
          data: { active: false },
        }),
      ]);
    }

    await prisma.cronHealth.upsert({
      where: { name: CRON_NAME },
      update: { lastRunAt: new Date(), lastStatus: "success", lastError: null },
      create: { name: CRON_NAME, lastRunAt: new Date(), lastStatus: "success" },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    await prisma.cronHealth.upsert({
      where: { name: CRON_NAME },
      update: {
        lastRunAt: new Date(),
        lastStatus: "error",
        lastError: err.message,
      },
      create: {
        name: CRON_NAME,
        lastRunAt: new Date(),
        lastStatus: "error",
        lastError: err.message,
      },
    });

    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await releaseCronLock(CRON_NAME);
  }
}