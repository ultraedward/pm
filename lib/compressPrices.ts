import { prisma } from "@/lib/prisma";

export async function compressPrices() {
  const now = Date.now();

  const oneMinute = 60 * 1000;
  const fiveMinutes = 5 * oneMinute;
  const oneHour = 60 * oneMinute;

  const day = 24 * oneHour;
  const week = 7 * day;

  const records = await prisma.price.findMany({
    orderBy: { timestamp: "asc" }
  });

  const deletes: string[] = [];

  let last5min = 0;
  let lastHour = 0;

  for (const record of records) {
    const ts = new Date(record.timestamp).getTime();
    const age = now - ts;

    if (age < day) continue;

    if (age < week) {
      if (ts - last5min < fiveMinutes) {
        deletes.push(record.id);
        continue;
      }
      last5min = ts;
      continue;
    }

    if (ts - lastHour < oneHour) {
      deletes.push(record.id);
      continue;
    }

    lastHour = ts;
  }

  if (deletes.length > 0) {
    await prisma.price.deleteMany({
      where: {
        id: {
          in: deletes
        }
      }
    });
  }

  return deletes.length;
}