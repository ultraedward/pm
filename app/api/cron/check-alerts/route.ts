import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { isCronEnabled } from "@/lib/cronGuard";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const CRON_NAME = "check-alerts";
const LOCK_TTL_SECONDS = 60;

export async function GET() {
  // 🔥 GLOBAL KILL SWITCH
  const enabled = await isCronEnabled(CRON_NAME);
  if (!enabled) {
    return NextResponse.json({
      ok: true,
      ran: false,
      skipped: "cron-disabled",
    });
  }

  // 🔒 DISTRIBUTED LOCK
  const hasLock = await acquireCronLock(CRON_NAME, LOCK_TTL_SECONDS);
  if (!hasLock) {
    return NextResponse.json({
      ok: true,
      ran: false,
      skipped: "lock-active",
    });
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

      await prisma.alert.update({
        where: { id: alert.id },
        data: { active: false },
      });

      await sendAlertEmail({
        alertId: alert.id,
        metal: alert.metal,
        price: latest.price,
        target: alert.target,
        direction: alert.direction,
      });
    }

    return NextResponse.json({
      ok: true,
      ran: true,
      message: "Alerts checked",
    });
  } catch (err) {
    console.error("CHECK ALERTS ERROR", err);
    return NextResponse.json(
      { ok: false, error: "failed" },
      { status: 500 }
    );
  } finally {
    await releaseCronLock(CRON_NAME);
  }
}