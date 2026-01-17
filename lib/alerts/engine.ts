// lib/alerts/engine.ts
// FULL FILE — COPY / PASTE EVERYTHING

import { prisma } from "@/lib/prisma";

type CheckResult = {
  alertId: string;
  metal: string;
  price: number;
};

export async function runAlertEngine(): Promise<CheckResult[]> {
  /**
   * We no longer have a `price` table.
   * AlertTrigger is the single source of truth for historical prices.
   * We read the most recent trigger per metal.
   */

  const rows = await prisma.alertTrigger.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    select: {
      price: true,
      Alert: {
        select: {
          id: true,
          metal: true,
        },
      },
    },
  });

  // Deduplicate by metal (latest per metal)
  const seen = new Set<string>();
  const latest: CheckResult[] = [];

  for (const r of rows) {
    const metal = r.Alert.metal;
    if (seen.has(metal)) continue;
    seen.add(metal);

    latest.push({
      alertId: r.Alert.id,
      metal,
      price: r.price,
    });
  }

  return latest;
}
