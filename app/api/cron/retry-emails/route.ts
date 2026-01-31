import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { sendRawEmail } from "@/lib/emailProvider";

export const dynamic = "force-dynamic";

const CRON_NAME = "retry-emails";
const LOCK_TTL_SECONDS = 60;

const MAX_ATTEMPTS = 5;

export async function GET() {
  const hasLock = await acquireCronLock(CRON_NAME, LOCK_TTL_SECONDS);
  if (!hasLock) {
    return NextResponse.json({ skipped: "lock-active" });
  }

  try {
    const failedEmails = await prisma.emailLog.findMany({
      where: {
        status: "failed",
        attempts: { lt: MAX_ATTEMPTS },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    for (const email of failedEmails) {
      try {
        const body = `
Alert Retry

Alert ID: ${email.alertId}
Subject: ${email.subject}

This is an automatic retry for a previously failed alert email.
        `.trim();

        await sendRawEmail({
          to: email.to,
          subject: email.subject,
          body,
        });

        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "sent",
            sentAt: new Date(),
            attempts: email.attempts + 1,
          },
        });
      } catch (err: any) {
        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            attempts: email.attempts + 1,
            error: err?.message ?? "unknown error",
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      retried: failedEmails.length,
    });
  } catch (err) {
    console.error("RETRY EMAILS ERROR", err);
    return NextResponse.json(
      { ok: false, error: "failed" },
      { status: 500 }
    );
  } finally {
    await releaseCronLock(CRON_NAME);
  }
}