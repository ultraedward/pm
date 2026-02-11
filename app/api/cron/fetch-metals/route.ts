import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function shouldTrigger(
  direction: string,
  target: number,
  current: number
) {
  if (direction === "above") return current >= target;
  if (direction === "below") return current <= target;
  return false;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch prices from Metals API
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
        { metal: "silver", price: silverPrice, source: "metals-api" }
      ]
    });

    // Evaluate alerts
    const activeAlerts = await prisma.alert.findMany({
      where: { active: true }
    });

    for (const alert of activeAlerts) {
      const current =
        alert.metal === "gold" ? goldPrice : silverPrice;

      const triggered = shouldTrigger(
        alert.direction,
        alert.price,
        current
      );

      if (!triggered) continue;

      // Prevent duplicate firing in short window
      if (alert.lastTriggeredAt) {
        const hoursSinceLast =
          (Date.now() - new Date(alert.lastTriggeredAt).getTime()) /
          (1000 * 60 * 60);

        if (hoursSinceLast < 6) continue;
      }

      // Create trigger record
      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: current
        }
      });

      // Update alert
      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          lastTriggeredAt: new Date()
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}