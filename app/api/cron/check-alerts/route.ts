import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function GET() {
  try {
    // HARD STOP: never touch prisma.alert.* (bypasses broken client cache)
    const alerts = await prisma.$queryRaw<
      {
        id: string;
        userId: string;
        metalId: string;
        targetPrice: number;
        direction: string;
        triggered: boolean;
        triggeredAt: Date | null;
      }[]
    >`
      SELECT
        id,
        "userId",
        "metalId",
        "targetPrice",
        direction,
        triggered,
        "triggeredAt"
      FROM "Alert"
      WHERE triggered = false
    `;

    if (alerts.length === 0) {
      return Response.json({ status: "ok", checked: 0, triggered: 0 });
    }

    const users = await prisma.$queryRaw<
      { id: string; email: string | null }[]
    >`
      SELECT id, email FROM "User"
    `;

    const metals = await prisma.$queryRaw<
      { id: string; name: string; symbol: string }[]
    >`
      SELECT id, name, symbol FROM "Metal"
    `;

    const prices = await prisma.$queryRaw<
      { metalId: string; value: number }[]
    >`
      SELECT DISTINCT ON ("metalId")
        "metalId",
        value
      FROM "Price"
      ORDER BY "metalId", timestamp DESC
    `;

    const userMap = new Map(users.map((u) => [u.id, u]));
    const metalMap = new Map(metals.map((m) => [m.id, m]));
    const priceMap = new Map(prices.map((p) => [p.metalId, p.value]));

    let triggered = 0;

    for (const alert of alerts) {
      const current = priceMap.get(alert.metalId);
      if (current == null) continue;

      const hit =
        (alert.direction === "above" && current >= alert.targetPrice) ||
        (alert.direction === "below" && current <= alert.targetPrice);

      if (!hit) continue;

      await prisma.$executeRaw`
        UPDATE "Alert"
        SET triggered = true,
            "triggeredAt" = NOW()
        WHERE id = ${alert.id}
      `;

      triggered++;

      const user = userMap.get(alert.userId);
      const metal = metalMap.get(alert.metalId);

      if (resend && user?.email && metal) {
        try {
          await resend.emails.send({
            from: "Precious Metals <alerts@yourdomain.com>",
            to: user.email,
            subject: `${metal.name} alert triggered`,
            html: `
              <h2>${metal.name} (${metal.symbol})</h2>
              <p>Target: $${alert.targetPrice}</p>
              <p>Current: $${current.toFixed(2)}</p>
            `,
          });
        } catch {}
      }
    }

    return Response.json({
      status: "ok",
      checked: alerts.length,
      triggered,
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
