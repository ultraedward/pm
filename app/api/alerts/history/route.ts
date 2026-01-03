import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true },
    });

    if (!user) {
      return Response.json({ alerts: [] });
    }

    const alerts = await prisma.alert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        metal: { select: { symbol: true } },
      },
    });

    return Response.json({
      alerts: alerts.map((a) => ({
        id: a.id,
        metal: a.metal,
        targetPrice: a.targetPrice,
        direction: a.direction,
        triggered: a.triggered,
        triggeredAt: a.triggeredAt
          ? a.triggeredAt.toISOString()
          : null,
      })),
    });
  } catch {
    return Response.json({ alerts: [] });
  }
}
