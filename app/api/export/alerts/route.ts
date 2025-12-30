// app/api/export/alerts/route.ts
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = await prisma.alert.findMany({
    include: { metal: true },
    orderBy: { createdAt: "asc" },
  });

  const header =
    "metal,condition,targetPrice,triggered,triggeredAt\n";
  const rows = alerts
    .map(
      (a) =>
        `${a.metal.name},${a.condition},${a.targetPrice},${a.triggered},${a.triggeredAt ?? ""}`
    )
    .join("\n");

  return new Response(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=alerts.csv",
    },
  });
}
