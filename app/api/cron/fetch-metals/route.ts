import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Ensure this route is never cached (important for cron)
export const dynamic = "force-dynamic";

type Metal = "gold" | "silver";
type Direction = "above" | "below";

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function safeNumber(n: unknown, fallback = 0) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : fallback;
}

async function sendAlertEmail(params: {
  to: string;
  metal: Metal;
  direction: Direction;
  currentPrice: number;
  percentChange24h: number;
  alertLabel: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.ALERT_FROM_EMAIL;

  // If email isn't configured, silently skip (don't break cron)
  if (!apiKey || !from) return;

  const resend = new Resend(apiKey);

  const subject = `${params.metal.toUpperCase()} alert: ${params.alertLabel}`;
  const emoji = params.percentChange24h >= 0 ? "▲" : "▼";

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
      <h2 style="margin: 0 0 8px;">${params.metal.toUpperCase()} alert</h2>
      <p style="margin: 0 0 12px; color: #374151;">Condition: <b>${params.alertLabel}</b></p>

      <div style="padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="font-size: 20px; font-weight: 700;">${fmtUsd(params.currentPrice)}</div>
        <div style="color: #6b7280;">24h: ${emoji} ${params.percentChange24h.toFixed(2)}%</div>
      </div>

      <p style="margin: 12px 0 0; color: #6b7280; font-size: 12px;">Sent by Precious Metals Prices & Alerts</p>
    </div>
  `;

  await resend.emails.send({
    from,
    to: params.to,
    subject,
    html,
  });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // --------------------------------------------------
    // 1️⃣ Fetch latest metal prices
    // --------------------------------------------------
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    // metals-api returns inverse rate (USD base)
    const goldPrice = 1 / safeNumber(data?.rates?.XAU);
    const silverPrice = 1 / safeNumber(data?.rates?.XAG);

    // --------------------------------------------------
    // 2️⃣ Store prices
    // --------------------------------------------------
    await prisma.price.createMany({
      data: [
        { metal: "gold", price: goldPrice, source: "metals-api" },
        { metal: "silver", price: silverPrice, source: "metals-api" },
      ],
    });

    // --------------------------------------------------
    // 3️⃣ Calculate 24h percent change (for percent alerts)
    // --------------------------------------------------
    async function get24hPercent(metal: Metal, current: number) {
      const first24h = await prisma.price.findFirst({
        where: {
          metal,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { timestamp: "asc" },
      });

      if (!first24h || !first24h.price) return 0;
      return ((current - first24h.price) / first24h.price) * 100;
    }

    const goldPercent = await get24hPercent("gold", goldPrice);
    const silverPercent = await get24hPercent("silver", silverPrice);

    // --------------------------------------------------
    // 4️⃣ Evaluate alerts (price + percent)
    // --------------------------------------------------
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      include: { user: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      const currentPrice = alert.metal === "gold" ? goldPrice : silverPrice;
      const currentPercent =
        alert.metal === "gold" ? goldPercent : silverPercent;

      let shouldTrigger = false;
      let alertLabel = "";

      // -------------------------------
      // PRICE ALERT
      // -------------------------------
      if (alert.type === "price" && alert.price !== null) {
        if (alert.direction === "above" && currentPrice >= alert.price) {
          shouldTrigger = true;
          alertLabel = `Price above ${fmtUsd(alert.price)}`;
        }

        if (alert.direction === "below" && currentPrice <= alert.price) {
          shouldTrigger = true;
          alertLabel = `Price below ${fmtUsd(alert.price)}`;
        }
      }

      // -------------------------------
      // PERCENT ALERT (24h)
      // -------------------------------
      if (alert.type === "percent" && alert.percentValue !== null) {
        if (alert.direction === "above" && currentPercent >= alert.percentValue) {
          shouldTrigger = true;
          alertLabel = `24h up ${alert.percentValue.toFixed(2)}%+`;
        }

        // For "below" we compare the negative move
        if (alert.direction === "below" && currentPercent <= -alert.percentValue) {
          shouldTrigger = true;
          alertLabel = `24h down ${alert.percentValue.toFixed(2)}%+`;
        }
      }

      // -------------------------------
      // Prevent re-trigger spam (1 per 6h)
      // -------------------------------
      const recentlyTriggered =
        alert.lastTriggeredAt &&
        Date.now() - new Date(alert.lastTriggeredAt).getTime() <
          6 * 60 * 60 * 1000;

      if (shouldTrigger && !recentlyTriggered) {
        triggeredCount++;

        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price: currentPrice,
          },
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: new Date() },
        });

        if (alert.user.email) {
          await sendAlertEmail({
            to: alert.user.email,
            metal: alert.metal as Metal,
            direction: alert.direction as Direction,
            currentPrice,
            percentChange24h: currentPercent,
            alertLabel,
          });
        }
      }
    }

    // --------------------------------------------------
    // 5️⃣ Response
    // --------------------------------------------------
    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
      gold24hPercent: goldPercent,
      silver24hPercent: silverPercent,
      alertsTriggered: triggeredCount,
    });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}