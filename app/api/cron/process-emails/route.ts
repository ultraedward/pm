import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/emailProvider";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

const LOCK_NAME = "cron:process-emails";

function backoff(attempt: number) {
  // exponential backoff: 1m, 5m, 15m, 1h, 6h
  const delays = [60, 300, 900, 3600, 21600];
  return delays[Math.min(attempt, delays.length - 1)] * 1000;
}

export async function GET() {
  const hasLock = await acquireCronLock(LOCK_NAME, 60);
  if (!hasLock) {
    return NextResponse.json({ skipped: "locked" });
  }

  try {
    const now = new Date();

    const emails = await prisma.emailDelivery.findMany({
      where: {
        status: "pending",
        nextAttemptAt: { lte: now },
      },
      take: 10,
    });

    for (const email of emails) {
      try {
        await sendEmail({
          to: email.to,
          subject: email.subject,
          body: email.body,
        });

        await prisma.emailDelivery.update({
          where: { id: email.id },
          data: {
            status: "sent",
          },
        });
      } catch (err: any) {
        const attempt = email.attemptCount + 1;
        const isDead = attempt >= email.maxAttempts;

        await prisma.emailDelivery.update({
          where: { id: email.id },
          data: {
            attemptCount: attempt,
            status: isDead ? "dead" : "pending",
            lastError: String(err),
            nextAttemptAt: new Date(
              Date.now() + backoff(attempt)
            ),
          },
        });
      }
    }

    return NextResponse.json({ processed: emails.length });
  } finally {
    await releaseCronLock(LOCK_NAME);
  }
}