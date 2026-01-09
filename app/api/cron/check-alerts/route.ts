import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendAlertEmail } from "@/lib/sendAlertEmail"

export const runtime = "nodejs"

// minutes between allowed fires
const COOLDOWN_MINUTES = 30

export async function GET() {
  try {
    const prices = await prisma.spotPriceCache.findMany({
      distinct: ["metal"],
      orderBy: { createdAt: "desc" },
    })

    const priceMap = Object.fromEntries(
      prices.map(p => [p.metal, p.price])
    )

    const alerts = await prisma.alert.findMany({
      include: {
        alertTriggers: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        user: true,
      },
    })

    const now = Date.now()
    let fired = 0

    for (const alert of alerts) {
      const currentPrice = priceMap[alert.metal]
      if (!currentPrice) continue

      const lastTrigger = alert.alertTriggers[0]

      // ⏱ cooldown check
      if (lastTrigger) {
        const minutesSince =
          (now - lastTrigger.createdAt.getTime()) / 60000
        if (minutesSince < COOLDOWN_MINUTES) continue
      }

      const shouldFire =
        (alert.direction === "above" && currentPrice >= alert.target) ||
        (alert.direction === "below" && currentPrice <= alert.target)

      if (!shouldFire) continue

      await prisma.alertTrigger.create({
        data: {
          alertId: alert.id,
          price: currentPrice,
        },
      })

      await sendAlertEmail({
        to: alert.user.email!,
        metal: alert.metal,
        direction: alert.direction,
        target: alert.target,
        currentPrice,
      })

      fired++
    }

    return NextResponse.json({
      ok: true,
      alertsChecked: alerts.length,
      alertsFired: fired,
      cooldownMinutes: COOLDOWN_MINUTES,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: "Cron failed", details: err.message },
      { status: 500 }
    )
  }
}
