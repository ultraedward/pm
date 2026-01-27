import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

export async function GET() {
  const LOCK = "cron:ingest-prices";

  const acquired = await acquireCronLock(LOCK, 10 * 60 * 1000);
  if (!acquired) {
    return NextResponse.json({ skipped: true, reason: "locked" });
  }

  try {
    // Example insert (replace with real ingest)
    await prisma.priceHistory.create({
      data: {
        metal: "gold",
        price: Math.random() * 3000,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  } finally {
    await releaseCronLock(LOCK);
  }
}