import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

export async function GET() {
  const LOCK = "cron:check-alerts";

  const acquired = await acquireCronLock(LOCK, 5 * 60 * 1000);
  if (!acquired) {
    return NextResponse.json({ skipped: true, reason: "locked" });
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    // placeholder processing
    console.log(`Checked ${alerts.length} alerts`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  } finally {
    await releaseCronLock(LOCK);
  }
}