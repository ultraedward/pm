import { prisma } from "@/lib/prisma";

export async function runAlertEngine(now: Date) {
  const triggers = await prisma.alertTrigger.findMany({
    where: {
      triggeredAt: null,
    },
    include: {
      alert: {
        select: {
          id: true,
          metal: true,
        },
      },
    },
    take: 100,
  });

  let fired = 0;

  for (const trigger of triggers) {
    const latest = await prisma.priceHistory.findFirst({
      where: {
        metal: trigger.alert.metal,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        price: true,
      },
    });

    if (!latest?.price) continue;

    // 🔥 PLACEHOLDER LOGIC
    // Replace later when alert rules are finalized
    await prisma.alertTrigger.update({
      where: { id: trigger.id },
      data: {
        triggeredAt: now,
        price: latest.price,
      },
    });

    fired++;
  }

  return {
    checked: triggers.length,
    fired,
  };
}
