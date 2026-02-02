import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/email";
import { requireCronAuth } from "@/lib/cronAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!requireCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    let triggered = 0;

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

      const fingerprint = `${alert.id}:${latest.id}`;

      const exists = await prisma.alertTrigger.findUnique({
        where: { fingerprint },
      });
      if (exists) continue;

      // 1️⃣ Record trigger
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          metal: alert.metal,
          target: alert.target,
          direction: alert.direction,
          price: latest.price,
          fingerprint,
        },
      });

      // 2️⃣ Email log
      await prisma.emailLog.create({
        data: {
          alertId: alert.id,
          to: alert.email ?? "",
          subject: `🚨 ${alert.metal.toUpperCase()} Alert`,
          status: "queued",
        },
      });

      // 3️⃣ SEND EMAIL (✅ correct contract)
      await sendAlertEmail({
        alertId: alert.id,
        metal: alert.metal,
        price: latest.price,
        target: alert.target,
        direction: alert.direction as "above" | "below",
      });

      // 4️⃣ Deactivate alert
      await prisma.alert.update({
        where: { id: alert.id },
        data: { active: false },
      });

      triggered++;
    }

    return NextResponse.json({
      ok: true,
      alertsChecked: alerts.length,
      triggered,
    });
  } catch (err) {
    console.error("CHECK ALERTS ERROR", err);
    return NextResponse.json(
      { ok: false, error: "failed" },
      { status: 500 }
    );
  }
}