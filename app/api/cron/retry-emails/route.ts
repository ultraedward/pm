import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;

function backoffSeconds(attempt: number) {
  return Math.pow(2, attempt) * 60; // 1m, 2m, 4m, 8m, 16m
}

export async function GET() {
  const enabled = await prisma.systemConfig.findUnique({
    where: { key: "CRON_ENABLED" },
  });

  if (enabled?.value === "false") {
    return NextResponse.json({ skipped: "cron-disabled" });
  }

  const LOCK = "cron:retry-emails";
  const hasLock = await acquireCronLock(LOCK, 120);
  if (!hasLock) {
    return NextResponse.json({ skipped: "lock-active" });
  }

  try {
    const now = new Date();

    const failed = await prisma.emailLog.findMany({
      where: {
        status: "failed",
        attempt: { lt: MAX_ATTEMPTS },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    let retried = 0;

    for (const email of failed) {
      const last = email.lastAttempt ?? email.createdAt;
      const wait = backoffSeconds(email.attempt);
      const nextTry = new Date(last.getTime() + wait * 1000);

      if (now < nextTry) continue;

      try {
        await sendAlertEmail({
          subject: email.subject,
          body: email.body,
          emailLogId: email.id,
        });
        retried++;
      } catch {
        // failure already recorded
      }
    }

    return NextResponse.json({ retried });
  } catch (err) {
    console.error("RETRY EMAIL ERROR", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  } finally {
    await releaseCronLock(LOCK);
  }
}