export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLivePrices } from "@/lib/prices";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const prices = await getLivePrices();
  const now = new Date();

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: { user: true },
  });

  const results = [];

  for (const alert of alerts) {
    const price = prices[alert.metal as keyof typeof prices];
    if (!price) continue;

    const triggered =
      alert.direction === "above"
        ? price >= alert.threshold
        : price <= alert.threshold;

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

        await resend.emails.send({
          from: process.env.ALERT_EMAIL_FROM!,
          to: alert.user.email,
          subject: `${alert.metal} price alert triggered`,
          html: `
            <h2>${alert.metal} Alert</h2>
            <p>Condition: ${alert.direction} ${alert.threshold}</p>
            <p>Current price: ${price}</p>
            <p>Cooldown: ${alert.cooldownHours} hours</p>
          `,
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            cooldownUntil: new Date(
              now.getTime() +
                alert.cooldownHours * 60 * 60 * 1000
            ),
          },
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
            error: err.message ?? "Email failed",
          },
        });
      }
    }

    results.push({
      alertId: alert.id,
      metal: alert.metal,
      price,
      triggered,
      emailed: shouldEmail,
    });
  }

  return NextResponse.json({ results });
}
