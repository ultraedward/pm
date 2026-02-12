import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/email/sendAlertEmail";

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
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    // metals-api returns inverse rate (USD base)
    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

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
    // 3️⃣ Calculate 24h percent change
    // --------------------------------------------------
    async function get24hPercent(metal: string, current: number) {
      const first24h = await prisma.price.findFirst({
        where: {
          metal,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { timestamp: "asc" },
      });

      if (!first24h) return 0;

      return ((current - first24h.price) / first24h.price) * 100;
    }

    const goldPercent = await get24hPercent("gold", goldPrice);
    const silverPercent = await get24hPercent("silver", silverPrice);

    // --------------------------------------------------
    // 4️⃣ Evaluate alerts
    // --------------------------------------------------
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      include: { user: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      const currentPrice =
        alert.metal === "gold" ? goldPrice : silverPrice;

      const currentPercent =
        alert.metal === "gold" ? goldPercent : silverPercent;

      let shouldTrigger = false;

      // -------------------------------
      // PRICE ALERT
      // -------------------------------
      if (alert.type === "price" && alert.price !== null) {
        if (
          alert.direction === "above" &&
          currentPrice >= alert.price
        ) {
          shouldTrigger = true;
        }

        if (
          alert.direction === "below" &&
          currentPrice <= alert.price
        ) {
          shouldTrigger = true;
        }
      }

      // -------------------------------
      // PERCENT ALERT
      // -------------------------------
      if (
        alert.type === "percent" &&
        alert.percentValue !== null
      ) {
        if (
          alert.direction === "above" &&
          currentPercent >= alert.percentValue
        ) {
          shouldTrigger = true;
        }

        if (
          alert.direction === "below" &&
          currentPercent <= -alert.percentValue
        ) {
          shouldTrigger = true;
        }
      }

      // -------------------------------
      // Prevent re-trigger spam (1 per 6h)
      // -------------------------------
      const recentlyTriggered =
        alert.lastTriggeredAt &&
        Date.now() -
          new Date(alert.lastTriggeredAt).getTime() <
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
            metal: alert.metal,
            direction: alert.direction,
            currentPrice,
            percentChange: currentPercent,
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