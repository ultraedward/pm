/**
 * Deduplicates Price rows that fall on the same calendar day for the same metal.
 * Keeps the row with the most recent timestamp (cron-inserted) and removes extras.
 * Run once after a backfill to clean up duplicate day entries.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const metals = ["gold", "silver", "platinum", "palladium"];

  for (const metal of metals) {
    const rows = await prisma.price.findMany({
      where: { metal },
      orderBy: { timestamp: "asc" },
      select: { id: true, timestamp: true, price: true },
    });

    // Group by calendar date (UTC)
    const byDay = new Map<string, typeof rows>();
    for (const row of rows) {
      const day = row.timestamp.toISOString().split("T")[0];
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(row);
    }

    const toDelete: string[] = [];
    for (const [day, group] of byDay) {
      if (group.length <= 1) continue;
      // Keep the one with the highest price (most likely the live cron entry)
      // or latest timestamp. We'll keep latest timestamp.
      const sorted = group.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      const keep = sorted[0];
      const discard = sorted.slice(1);
      console.log(
        `  ${metal} ${day}: ${group.length} rows → keeping $${keep.price.toFixed(2)} @ ${keep.timestamp.toISOString()}, removing ${discard.length}`
      );
      toDelete.push(...discard.map((r) => r.id));
    }

    if (toDelete.length > 0) {
      await prisma.price.deleteMany({ where: { id: { in: toDelete } } });
      console.log(`✅ ${metal}: removed ${toDelete.length} duplicate(s)`);
    } else {
      console.log(`✓  ${metal}: no duplicates`);
    }
  }

  await prisma.$disconnect();
  console.log("\nDone.");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
