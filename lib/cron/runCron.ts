import { prisma } from "@/lib/prisma";
import { fetchPrices } from "@/lib/prices/fetchPrices";
import { evaluateAlert, AlertDirection } from "@/lib/alerts/evaluateAlert";

export async function runCronJob() {
  const cronRun = await prisma.cronRun.create({
    data: { status: "running" },
  });

  try {
    const prices = await fetchPrices();

    for (const p of prices) {
      await prisma.price.create({
        data: {
          metal: p.metal,
          price: p.price,
          source: p.source,
        },
      });

      const alerts = await prisma.alert.findMany({
        where: {
          metal: p.metal,
          active: true,
        },
      });

      for (const alert of alerts) {
        // 🔑 normalize direction ONCE
        const direction = alert.direction as AlertDirection;

        const shouldTrigger = evaluateAlert(
          alert.price,
          p.price,
          direction
        );

        if (!shouldTrigger) continue;

        const alreadyTriggered = await prisma.alertTrigger.findFirst({
          where: {
            alertId: alert.id,
            price: p.price,
          },
        });

        if (alreadyTriggered) continue;

        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price: p.price,
          },
        });
      }
    }

    await prisma.cronRun.update({
      where: { id: cronRun.id },
      data: {
        status: "success",
        finishedAt: new Date(),
      },
    });

    return { ok: true };
  } catch (err: any) {
    await prisma.cronRun.update({
      where: { id: cronRun.id },
      data: {
        status: "error",
        error: err?.message ?? "Unknown error",
        finishedAt: new Date(),
      },
    });

    throw err;
  }
}