import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

const prisma = new PrismaClient();

const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  const LOCK_NAME = "cron:ingest-prices";

  const hasLock = await acquireCronLock(LOCK_NAME, 60);
  if (!hasLock) {
    return NextResponse.json({ skipped: "lock-active" });
  }

  try {
    for (const metal of METALS) {
      const price = Math.random() * 100 + 1000; // replace with real feed

      await prisma.priceHistory.create({
        data: {
          metal,
          price,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("INGEST ERROR", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  } finally {
    await releaseCronLock(LOCK_NAME);
  }
}