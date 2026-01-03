import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.findFirst({
    select: { id: true, stripeStatus: true },
  });

  if (!user || user.stripeStatus !== "active") {
    return new Response("Pro subscription required\n", { status: 403 });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { metal: { select: { name: true, symbol: true } } },
  });

  const header =
    "createdAt,metal,symbol,direction,targetPrice,triggered";
  const rows = alerts.map((a) =>
    [
      a.createdAt.toISOString(),
      a.metal.name,
      a.metal.symbol,
      a.direction,
      a.targetPrice,
      a.triggered,
    ].join(",")
  );

  return new Response([header, ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="alerts.csv"',
    },
  });
}
