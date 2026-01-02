export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOLDOWN_HOURS = 24;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getMockPrices() {
  return {
    Gold: 2042.35,
    Silver: 24.88,
    Platinum: 921.12,
    Palladium: 1012.44,
  };
}

export async function GET() {
  const prices = getMockPrices();
  const now = new Date();

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: { user: true },
  });

  const results = [];

  for (const alert of alerts) {
    const price = prices[alert.metal as keyof typeof prices];
    if (price === undefined) continue;

    const triggered =
      alert.direction === "above"
        ? price >= alert.threshold
        : price <= alert.threshold;

    // cooldown check
    const inCooldown =
      alert.cooldownUntil && alert.cooldownUntil > now;

    const lastTrigger = await prisma.alertTrigger.findFirst({
      where: { alertId: alert.id },
      orderBy: { createdAt: "desc" },
    });

    const shouldEmail =
      triggered &&
      !inCooldown &&
      (!lastTrigger || lastTrigger.triggered === false);

    // record trigger attempt
    await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        userId: alert.userId,
        metal: alert.metal,
        price,
        triggered,
      },
    });

    if (
      shouldEmail &&
      alert.user &&
      isValidEmail(alert.user.email) &&
      process.env.RESEND_API_KEY
    ) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const html = `
          <h2>Price Alert Triggered</h2>
          <p><strong>${alert.metal}</strong> is now ${
          alert.direction
        } ${alert.threshold}</p>
          <p>Current price: <strong>${price}</strong></p>
          <p>You will not be notified again for ${COOLDOWN_HOURS} hours.</p>
        `;

        await resend.emails.send({
          from: process.env.ALERT_EMAIL_FROM!,
          to: alert.user.email,
          subject: `${alert.metal} price alert triggered`,
          html,
        });

        // set cooldown
        const cooldownUntil = new Date(
          now.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000
        );

        await prisma.alert.update({
          where: { id: alert.id },
          data: { cooldownUntil },
        });

        await prisma.emailLog.create({
          data: {
            userId: alert.userId,
            status: "sent",
          },
        });
      } catch (err: any) {
        await prisma.emailLog.create({
          data: {
            userId: alert.userId,
            status: "failed",
            error: err.message ?? "Email send failed",
          },
        });
      }
    }

    results.push({
      alertId: alert.id,
      metal: alert.metal,
      price,
      threshold: alert.threshold,
      triggered,
      inCooldown,
      emailed: shouldEmail,
    });
  }

  return NextResponse.json({
    checked: alerts.length,
    results,
  });
}
