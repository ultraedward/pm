import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // -------------------------------------
    // 1️⃣ Fetch latest prices
    // -------------------------------------
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    // -------------------------------------
    // 2️⃣ Insert new price rows
    // -------------------------------------
    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          source: "metals-api",
        },
        {
          metal: "silver",
          price: silverPrice,
          source: "metals-api",
        },
      ],
    });

    // -------------------------------------
    // 3️⃣ Get price closest to 24h ago
    // -------------------------------------
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [goldOld, silverOld] = await Promise.all([
      prisma.price.findFirst({
        where: {
          metal: "gold",
          timestamp: {
            gte: new Date(twentyFourHoursAgo.getTime() - 60 * 60 * 1000),
            lte: new Date(twentyFourHoursAgo.getTime() + 60 * 60 * 1000),
          },
        },
        orderBy: { timestamp: "desc" },
      }),
      prisma.price.findFirst({
        where: {
          metal: "silver",
          timestamp: {
            gte: new Date(twentyFourHoursAgo.getTime() - 60 * 60 * 1000),
            lte: new Date(twentyFourHoursAgo.getTime() + 60 * 60 * 1000),
          },
        },
        orderBy: { timestamp: "desc" },
      }),
    ]);

    // Fallback if no 24h data exists yet
    const goldPrevious =
      goldOld ||
      (await prisma.price.findFirst({
        where: { metal: "gold" },
        orderBy: { timestamp: "asc" },
      }));

    const silverPrevious =
      silverOld ||
      (await prisma.price.findFirst({
        where: { metal: "silver" },
        orderBy: { timestamp: "asc" },
      }));

    const gold24hPercent =
      goldPrevious && goldPrevious.price
        ? ((goldPrice - goldPrevious.price) / goldPrevious.price) * 100
        : 0;

    const silver24hPercent =
      silverPrevious && silverPrevious.price
        ? ((silverPrice - silverPrevious.price) / silverPrevious.price) * 100
        : 0;

    // -------------------------------------
    // 4️⃣ Evaluate Alerts
    // -------------------------------------
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

      // ---- Absolute Price Alert ----
      if (!alert.percentChange && alert.price) {
        if (alert.direction === "above" && currentPrice >= alert.price) {
          shouldTrigger = true;
        }
        if (alert.direction === "below" && currentPrice <= alert.price) {
          shouldTrigger = true;
        }
      }

      // ---- Percent Alert ----
      if (alert.percentChange !== null) {
        if (
          alert.direction === "above" &&
          currentPercent >= alert.percentChange
        ) {
          shouldTrigger = true;
        }

        if (
          alert.direction === "below" &&
          currentPercent <= -alert.percentChange
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

    // -------------------------------------
    // 5️⃣ Response
    // -------------------------------------
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