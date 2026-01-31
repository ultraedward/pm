import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { isProUser } from "@/lib/isProUser";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const LOCK_NAME = "cron:check-alerts";

export async function GET() {
  const hasLock = await acquireCronLock(LOCK_NAME, 120);

  if (!hasLock) {
    return NextResponse.json({
      skipped: "lock-active",
    });
  }

  try {
    // ✅ FETCH ALERTS (this was missing)
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });

    let triggered = 0;
    let skippedNonPro = 0;

    for (const alert of alerts) {
      // 🔒 PRO GATING
      const pro = await isProUser(alert.userId);
      if (!pro) {
        skippedNonPro++;
        continue;
      }

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

      // 📧 SEND EMAIL
      await sendAlertEmail({
        to: alert.email!,
        metal: alert.metal,
        price: latest.price,
        target: alert.target,
        direction: alert.direction as "above" | "below",
      });

      // 🔕 DEACTIVATE ALERT
      await prisma.alert.update({
        where: { id: alert.id },
        data: { active: false },
      });

      triggered++;
    }

    return NextResponse.json({
      ok: true,
      checked: alerts.length,
      triggered,
      skippedNonPro,
    });
  } catch (err) {
    console.error("CHECK ALERTS ERROR", err);
    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  } finally {
    await releaseCronLock(LOCK_NAME);
  }
}