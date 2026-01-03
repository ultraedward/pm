import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function GET() {
  try {
    console.log("CRON: check-alerts start");

    const alerts = await prisma.alert.findMany({
      where: { triggered: false },
      include: {
        user: true, // ✅ this relation exists
      },
    });

    console.log("CRON: alerts found", alerts.length);

    if (alerts.length === 0) {
      return Response.json({ status: "ok", checked: 0, triggered: 0 });
    }

    // Fetch metals once
    const metals = await prisma.metal.findMany();
    const metalMap = new Map(
      metals.map((m) => [m.id, m])
    );

    // Fetch latest prices
    const prices = await prisma.price.findMany({
      orderBy: { timestamp: "desc" },
    });

    const latestPriceByMetal = new Map<string, number>();
    for (const p of prices) {
      if (!latestPriceByMetal.has(p.metalId)) {
        latestPriceByMetal.set(p.metalId, p.value);
      }
    }

    let triggeredCount = 0;

    for (const alert of alerts) {
      const current = latestPriceByMetal.get(alert.metalId);
      if (current == null) continue;

      const shouldTrigger =
        (alert.direction === "above" && current >= alert.targetPrice) ||
        (alert.direction === "below" && current <= alert.targetPrice);

      if (!shouldTrigger) continue;

      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          triggered: true,
          triggeredAt: new Date(),
        },
      });

      triggeredCount++;

      const metal = metalMap.get(alert.metalId);

      if (resend && alert.user?.email && metal) {
        try {
          await resend.emails.send({
            from: "Precious Metals <alerts@yourdomain.com>",
            to: alert.user.email,
            subject: `${metal.name} price alert triggered`,
            html: `
              <h2>${metal.name} (${metal.symbol})</h2>
              <p>Your alert has triggered.</p>
              <p>
                Target: <b>$${alert.targetPrice}</b><br/>
                Current: <b>$${current.toFixed(2)}</b>
              </p>
            `,
          });
        } catch (emailErr) {
          console.error("CRON: email failed", emailErr);
        }
      }
    }

    console.log("CRON: done", { triggeredCount });

    return Response.json({
      status: "ok",
      checked: alerts.length,
      triggered: triggeredCount,
    });
  } catch (err) {
    console.error("CRON: fatal error", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
