import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";
import { sendRawEmail } from "@/lib/emailProvider";

export const dynamic = "force-dynamic";

const CRON_NAME = "process-emails";
const LOCK_TTL_SECONDS = 60;

export async function GET() {
  const hasLock = await acquireCronLock(CRON_NAME, LOCK_TTL_SECONDS);
  if (!hasLock) {
    return NextResponse.json({ skipped: "lock-active" });
  }

  try {
    const queued = await prisma.emailLog.findMany({
      where: { status: "queued" },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    for (const email of queued) {
      try {
        await sendRawEmail({
          to: email.to,
          subject: email.subject,
          body: email.body,
        });

        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        });
      } catch (err: any) {
        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "failed",
            error: err?.message ?? "unknown error",
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      processed: queued.length,
    });
  } catch (err) {
    console.error("PROCESS EMAILS ERROR", err);
    return NextResponse.json(
      { ok: false, error: "failed" },
      { status: 500 }
    );
  } finally {
    await releaseCronLock(CRON_NAME);
  }
}