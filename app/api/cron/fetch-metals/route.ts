import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/alerts/sendAlertEmail";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1️⃣ Fetch latest prices
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    // API returns USD per 1 metal unit inverted
    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    const now = new Date();

    // 2️⃣ Store prices
    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          source: "metals-api",
          timestamp: now,
        },
        {
          metal: "silver",
          price: silverPrice,
          source: "metals-api",
          timestamp: now,
        },
      ],
    });

    // 3️⃣ Get active alerts with user
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      include: { user: true },
    });

    let triggeredCount = 0;

    // 4️⃣ Evaluate alerts
    for (const alert of alerts) {
      const currentPrice =
        alert.metal === "gold" ? goldPrice : silverPrice;

      const shouldTrigger =
        (alert.direction === "above" &&
          currentPrice >= alert.price) ||
        (alert.direction === "below" &&
          currentPrice <= alert.price);

      if (!shouldTrigger) continue;

      // ⏱ Cooldown protection (30 min default)
      const cooldownMinutes =
        Number(process.env.ALERT_COOLDOWN_MIN) || 30;

      if (
        alert.lastTriggeredAt &&
        new Date().getTime() -
          new Date(alert.lastTriggeredAt).getTime() <
          cooldownMinutes * 60 * 1000
      ) {
        continue;
      }

      // 5️⃣ Create trigger record
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: currentPrice,
          triggeredAt: now,
        },
      });

      // 6️⃣ Update lastTriggeredAt
      await prisma.alert.update({
        where: { id: alert.id },
        data: { lastTriggeredAt: now },
      });

      // 7️⃣ Send email
      if (alert.user.email) {
        await sendAlertEmail({
          to: alert.user.email,
          metal: alert.metal,
          price: currentPrice,
          direction: alert.direction,
        });
      }

      triggeredCount++;
    }

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
      alertsTriggered: triggeredCount,
    });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}