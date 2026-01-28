import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  const lockName = "ingest-prices";

  const acquired = await acquireCronLock(lockName);
  if (!acquired) {
    return NextResponse.json({ skipped: true });
  }

  try {
    for (const metal of METALS) {
      const price =
        metal === "gold"
          ? 2000 + Math.random() * 50
          : metal === "silver"
          ? 25 + Math.random()
          : metal === "platinum"
          ? 900 + Math.random() * 10
          : 950 + Math.random() * 10;

      await prisma.priceHistory.create({
        data: {
          metal,
          price,
        },
      });
    }

    return NextResponse.json({ success: true });
  } finally {
    await releaseCronLock(lockName);
  }
}