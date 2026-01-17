import { prisma } from "@/lib/prisma";

export async function getSpotPrice(
  metal: string
): Promise<number | null> {
  const row = await prisma.alertTrigger.findFirst({
    where: {
      alert: {
        metal,
      },
      price: { not: null },
    },
    orderBy: {
      triggeredAt: "desc",
    },
    select: {
      price: true,
    },
  });

  return row?.price ?? null;
}
