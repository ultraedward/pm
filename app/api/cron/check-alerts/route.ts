import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";
import {
  ALERT_COOLDOWN_MS,
  buildTriggerFingerprint,
} from "@/lib/alertConfig";
import { sendAlertEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: {
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
    },
  });

  let alertsChecked = 0;
  let triggered = 0;

  for (const alert of alerts) {
    alertsChecked++;

    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) continue;

    const price = latest.price;

    const conditionMet =
      (alert.direction === "above" && price >= alert.target) ||
      (alert.direction === "below" && price <= alert.target);

    if (!conditionMet) continue;

    // ⏱️ COOLDOWN CHECK
    const lastTrigger = alert.triggers[0];
    if (
      lastTrigger &&
      Date.now() - new Date(lastTrigger.triggeredAt).getTime() <
        ALERT_COOLDOWN_MS
    ) {
      continue;
    }

    const fingerprint = buildTriggerFingerprint(alert.id, price);

    try {
      // 🧠 IDMPOTENT TRIGGER CREATE
      const trigger = await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          metal: alert.metal,
          target: alert.target,
          direction: alert.direction,
          price,
          fingerprint,
        },
      });

      // 📧 QUEUE EMAIL (ONLY AFTER TRIGGER)
      await sendAlertEmail({
        alertId: alert.id,
        metal: alert.metal,
        price,
        target: alert.target,
        direction: alert.direction as "above" | "below",
      });

      triggered++;
    } catch (err: any) {
      // Unique constraint = already triggered → safe ignore
      if (err.code === "P2002") {
        continue;
      }

      console.error("check-alerts error", err);
    }
  }

  return NextResponse.json({
    ok: true,
    alertsChecked,
    triggered,
  });
}