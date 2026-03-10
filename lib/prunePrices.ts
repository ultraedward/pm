import { prisma } from "@/lib/prisma";

export async function prunePrices() {
  const records = await prisma.price.findMany({
    orderBy: { timestamp: "asc" },
  });

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const deletes: string[] = [];

  for (const record of records) {
    const age = now - new Date(record.timestamp).getTime();

    if (age > 30 * day) {
      deletes.push(record.id);
      continue;
    }
  }

  if (deletes.length > 0) {
    await prisma.price.deleteMany({
      where: {
        id: {
          in: deletes,
        },
      },
    });
  }
}