import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { sendRawEmail } from "@/lib/emailProvider";

export const dynamic = "force-dynamic";

const CRON_NAME = "retry-emails";
const LOCK_TTL_SECONDS = 60;
const MAX_RETRIES = 5;

export async function GET() {
  const hasLock = await acquireCronLock(CRON_NAME, LOCK_TTL_SECONDS);
  if (!hasLock) {
    return NextResponse.json({ ok: true, skipped: "lock-active" });
  }

  try {
    const failedEmails = await prisma.emailLog.findMany({
      where: {
        status: "failed",
        retries: { lt: MAX_RETRIES },
      },
      take: 10,
    });

    for (const email of failedEmails) {
      try {
        await sendRawEmail({
          to: email.to,
          subject: email.subject,
          html: email.body,
        });

        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        });
      } catch (err) {
        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            retries: { increment: 1 },
            lastError: String(err),
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      retried: failedEmails.length,
    });
  } finally {
    await releaseCronLock(CRON_NAME);
  }
}