// app/dashboard/alerts/alert-history.tsx

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function getAlertHistory() {
  return prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
