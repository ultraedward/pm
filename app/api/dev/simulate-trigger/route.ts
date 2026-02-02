import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/email";
import { isFeatureDisabled, allowDevOverride } from "@/lib/featureFlags";

export const dynamic = "force-dynamic";

const DEV_SECRET = process.env.DEV_SECRET;

export async function GET(req: Request) {
  // 🔐 DEV AUTH
  const auth = req.headers.get("authorization");
  if (!DEV_SECRET || auth !== `Bearer ${DEV_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // 🚧 FEATURE GATE (DEV OVERRIDE ALLOWED)
  if (isFeatureDisabled("alerts") && !allowDevOverride(req)) {
    return NextResponse.json({
      ok: false,
      disabled: true,
      reason: "Feature temporarily disabled during schema stabilization",
    });
  }

  try {
    // 1️⃣ Latest GOLD price
    const latest = await prisma.priceHistory.findFirst({
      where: { metal: "gold" },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { ok: false, error: "no_price_data" },
        { status: 400 }
      );
    }

    // 2️⃣ Active alerts
    const alerts = await prisma.alert.findMany({
      where: {
        active: true,
        metal: "gold",
      },
      include: { user: true },
    });

    let triggered = 0;

    for (const alert of alerts) {
      const fingerprint = `${alert.id}:${latest.id}`;

      const exists = await prisma.alertTrigger.findUnique({
        where: { fingerprint },
      });
      if (exists) continue;

      // 3️⃣ Trigger record
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

      // 4️⃣ Email log
      await prisma.emailLog.create({
        data: {
          alertId: alert.id,
          to: alert.email ?? alert.user.email,
          subject: `🚨 TEST ALERT: ${alert.metal.toUpperCase()}`,
          status: "queued",
        },
      });

      // 5️⃣ Send email
      await sendAlertEmail({
        metal: alert.metal,
        price: latest.price,
        target: alert.target,
        direction: alert.direction as "above" | "below",
        email: alert.email ?? alert.user.email,
        test: true,
      });

      triggered++;
    }

    return NextResponse.json({
      ok: true,
      latestPrice: latest.price,
      alertsFound: alerts.length,
      triggered,
    });
  } catch (err: any) {
    console.error("SIMULATE TRIGGER ERROR", err);
    return NextResponse.json(
      {
        ok: false,
        error: "simulate_failed",
        message: err?.message ?? "unknown_error",
      },
      { status: 500 }
    );
  }
}