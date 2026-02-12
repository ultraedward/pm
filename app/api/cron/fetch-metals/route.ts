import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOLDOWN_MINUTES = 60; // prevent repeat spam

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // -----------------------------
    // 1️⃣ Fetch latest prices
    // -----------------------------
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) throw new Error("Metals API failed");

    const data = await res.json();

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    // Save prices
    await prisma.price.createMany({
      data: [
        { metal: "gold", price: goldPrice, source: "metals-api" },
        { metal: "silver", price: silverPrice, source: "metals-api" },
      ],
    });

    // -----------------------------
    // 2️⃣ Get 24h ago prices
    // -----------------------------
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [goldOld, silverOld] = await Promise.all([
      prisma.price.findFirst({
        where: {
          metal: "gold",
          timestamp: { lte: twentyFourHoursAgo },
        },
        orderBy: { timestamp: "desc" },
      }),
      prisma.price.findFirst({
        where: {
          metal: "silver",
          timestamp: { lte: twentyFourHoursAgo },
        },
        orderBy: { timestamp: "desc" },
      }),
    ]);

    const goldPercent =
      goldOld && goldOld.price
        ? ((goldPrice - goldOld.price) / goldOld.price) * 100
        : 0;

    const silverPercent =
      silverOld && silverOld.price
        ? ((silverPrice - silverOld.price) / silverOld.price) * 100
        : 0;

    // -----------------------------
    // 3️⃣ Evaluate alerts
    // -----------------------------
    const alerts = await prisma.alert.findMany({
      where: { active: true },
      include: { user: true },
    });

    let alertsTriggered = 0;
    const now = new Date();

    for (const alert of alerts) {
      const currentPrice =
        alert.metal === "gold" ? goldPrice : silverPrice;

      const percentChange =
        alert.metal === "gold" ? goldPercent : silverPercent;

      // Cooldown check
      if (
        alert.lastTriggeredAt &&
        now.getTime() - alert.lastTriggeredAt.getTime() <
          COOLDOWN_MINUTES * 60 * 1000
      ) {
        continue;
      }

      let shouldTrigger = false;

      // -----------------------------
      // PRICE ALERT
      // -----------------------------
      if (alert.type === "price" && alert.price != null) {
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

      // -----------------------------
      // PERCENT ALERT (24h move)
      // -----------------------------
      if (
        alert.type === "percent" &&
        alert.percentValue != null
      ) {
        if (
          alert.direction === "above" &&
          percentChange >= alert.percentValue
        ) {
          shouldTrigger = true;
        }

        if (
          alert.direction === "below" &&
          percentChange <= -alert.percentValue
        ) {
          shouldTrigger = true;
        }
      }

      // -----------------------------
      // TRIGGER
      // -----------------------------
      if (shouldTrigger) {
        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price: currentPrice,
          },
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: now },
        });

        alertsTriggered++;
      }
    }

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
      gold24hPercent: goldPercent,
      silver24hPercent: silverPercent,
      alertsTriggered,
    });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}