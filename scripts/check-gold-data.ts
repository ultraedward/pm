import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Count all entries per metal
  const metals = ["gold", "silver", "platinum", "palladium"];

  console.log("=== Entries per metal ===");
  for (const metal of metals) {
    const count = await prisma.price.count({ where: { metal } });
    const oldest = await prisma.price.findFirst({ where: { metal }, orderBy: { timestamp: "asc" } });
    const newest = await prisma.price.findFirst({ where: { metal }, orderBy: { timestamp: "desc" } });
    console.log(
      `${metal.padEnd(10)} ${String(count).padStart(3)} entries  ` +
      `${oldest?.timestamp.toISOString().split("T")[0] ?? "—"} → ${newest?.timestamp.toISOString().split("T")[0] ?? "—"}  ` +
      `latest: $${newest?.price.toFixed(2) ?? "—"}`
    );
  }

  // Gold detail for last 10 days
  const tenDaysAgo = new Date();
  tenDaysAgo.setUTCDate(tenDaysAgo.getUTCDate() - 10);

  const recentGold = await prisma.price.findMany({
    where: { metal: "gold", timestamp: { gte: tenDaysAgo } },
    orderBy: { timestamp: "asc" },
  });

  console.log(`\n=== Gold last 10 days (${recentGold.length} rows) ===`);
  if (recentGold.length === 0) {
    console.log("  ⚠  NO gold data found in last 10 days!");
  } else {
    recentGold.forEach((r) =>
      console.log(`  ${r.timestamp.toISOString().split("T")[0]}  $${r.price.toFixed(2)}`)
    );
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
