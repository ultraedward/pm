import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/sendAlertEmail";
import { isProUser } from "@/lib/isProUser";

export const dynamic = "force-dynamic";

function passesCondition(direction: string, price: number, target: number) {
  if (direction === "above") return price >= target;
  if (direction === "below") return price <= target;
  return false;
}

function buildFingerprint(input: {
  alertId: string;
  metal: string;
  target: number;
  direction: string;
  price: number;
}) {
  // stable enough + unique (fingerprint is unique in schema)
  // You can swap in a hash later, but this works fine.
  const p = Number(input.price).toFixed(6);
  const t = Number(input.target).toFixed(6);
  return `${input.alertId}:${input.metal}:${input.direction}:${t}:${p}`;
}

export async function GET(req: NextRequest) {
  try {
    // Optional protection (works with either header)
    const auth = req.headers.get("authorization") || "";
    const cronSecret = req.headers.get("x-cron-secret") || "";
    const expected = process.env.CRON_SECRET;

    if (expected) {
      const bearerOk = auth.startsWith("Bearer ") && auth.slice(7) === expected;
      const headerOk = cronSecret === expected;
      if (!bearerOk && !headerOk) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
    }

    // Global kill switch
    const ctrl = await prisma.cronControl.findFirst().catch(() => null);
    if (ctrl && !ctrl.cronEnabled) {
      return NextResponse.json({ ok: false, disabled: true, reason: "cron disabled" });
    }

    // Pull active alerts (that have an email)
    const alerts = await prisma.alert.findMany({
      where: {
        active: true,
        email: { not: null },
      },
      orderBy: { createdAt: "asc" },
      take: 2000,
    });

    if (alerts.length === 0) {
      return NextResponse.json({ ok: true, checked: 0, triggered: 0, queued: 0 });
    }

    // Latest prices per metal (from PriceHistory)
    const metals = Array.from(new Set(alerts.map((a) => a.metal)));

    const latestByMetal = new Map<string, { price: number; createdAt: Date }>();
    await Promise.all(
      metals.map(async (metal) => {
        const latest = await prisma.priceHistory.findFirst({
          where: { metal },
          orderBy: { createdAt: "desc" },
        });
        if (latest) latestByMetal.set(metal, { price: latest.price, createdAt: latest.createdAt });
      })
    );

    let checked = 0;
    let triggered = 0;
    let queued = 0;

    for (const alert of alerts) {
      checked++;

      // Pro gating: if not pro, skip evaluation entirely
      const pro = await isProUser(alert.userId);
      if (!pro) continue;

      const latest = latestByMetal.get(alert.metal);
      if (!latest) continue;

      const shouldTrigger = passesCondition(alert.direction, latest.price, alert.target);
      if (!shouldTrigger) continue;

      const fingerprint = buildFingerprint({
        alertId: alert.id,
        metal: alert.metal,
        target: alert.target,
        direction: alert.direction,
        price: latest.price,
      });

      // Create trigger row (dedupe via unique fingerprint)
      try {
        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            metal: alert.metal,
            target: alert.target,
            direction: alert.direction,
            price: latest.price,
            fingerprint,
            triggeredAt: new Date(),
          },
        });
      } catch (e: any) {
        // If fingerprint already exists, it's a duplicate trigger attempt — ignore
        continue;
      }

      triggered++;

      // Queue email
      const to = alert.email!;
      const subject = `Price Alert: ${alert.metal.toUpperCase()} ${alert.direction} ${alert.target}`;
      const html = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
          <h2 style="margin:0 0 12px;">Price Alert</h2>
          <p style="margin:0 0 6px;"><b>Metal:</b> ${alert.metal}</p>
          <p style="margin:0 0 6px;"><b>Direction:</b> ${alert.direction}</p>
          <p style="margin:0 0 6px;"><b>Target:</b> ${alert.target}</p>
          <p style="margin:0 0 14px;"><b>Current price:</b> ${latest.price}</p>
          <p style="margin:0;opacity:0.75;">Triggered at ${new Date().toISOString()}</p>
        </div>
      `;

      await sendAlertEmail({
        alertId: alert.id,
        to,
        subject,
        html,
      });

      queued++;
    }

    return NextResponse.json({ ok: true, checked, triggered, queued });
  } catch (err: any) {
    console.error("cron/check-alerts failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}