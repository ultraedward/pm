// app/api/cron/move-prices/route.ts
import { prisma } from "../../../../lib/prisma";
import { movePrices } from "../../../../lib/fakePriceEngine";
import { evaluateAlerts } from "../../../../lib/alertEngine";
import { sendNotifications } from "../../../../lib/notificationEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");

  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  await movePrices();
  await evaluateAlerts();
  await sendNotifications();

  await prisma.cronStatus.upsert({
    where: { name: "price-engine" },
    update: {
      lastRun: new Date(),
      message: "Prices, alerts, notifications processed",
    },
    create: {
      name: "price-engine",
      lastRun: new Date(),
      message: "Initial run",
    },
  });

  return Response.json({ status: "ok" });
}
