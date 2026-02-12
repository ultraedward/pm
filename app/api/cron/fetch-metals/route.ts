import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch latest prices
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    // Insert price rows
    await prisma.price.createMany({
      data: [
        { metal: "gold", price: goldPrice, source: "metals-api" },
        { metal: "silver", price: silverPrice, source: "metals-api" },
      ],
    });

    // Calculate 24h percent change
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

    const gold24hPercent =
      goldOld && goldOld.price
        ? ((goldPrice - goldOld.price) / goldOld.price) * 100
        : 0;

    const silver24hPercent =
      silverOld && silverOld.price
        ? ((silverPrice - silverOld.price) / silverOld.price) * 100
        : 0;

    // Evaluate alerts
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    let triggeredCount = 0;

    for (const alert of alerts) {
      const currentPrice =
        alert.metal === "gold" ? goldPrice : silverPrice;

      const currentPercent =
        alert.metal === "gold" ? gold24hPercent : silver24hPercent;

      let shouldTrigger = false;

      // Absolute price alerts
      if (alert.type === "price" && alert.price !== null) {
        if (alert.direction === "above" && currentPrice >= alert.price) {
          shouldTrigger = true;
        }
        if (alert.direction === "below" && currentPrice <= alert.price) {
          shouldTrigger = true;
        }
      }

      // Percent alerts
      if (alert.type === "percent" && alert.percentValue !== null) {
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

      if (shouldTrigger) {
        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price: currentPrice,
          },
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            active: false,
            lastTriggeredAt: new Date(),
          },
        });

        triggeredCount++;
      }
    }

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
      gold24hPercent,
      silver24hPercent,
      alertsTriggered: triggeredCount,
    });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}