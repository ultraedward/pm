import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY!);

const BATCH_SIZE = 25;
const MAX_ATTEMPTS = 5;

export async function GET(req: NextRequest) {
  try {
    // Optional cron auth
    const auth = req.headers.get("authorization") || "";
    const cronSecret = req.headers.get("x-cron-secret") || "";
    const expected = process.env.CRON_SECRET;

    if (expected) {
      const bearerOk = auth.startsWith("Bearer ") && auth.slice(7) === expected;
      const headerOk = cronSecret === expected;
      if (!bearerOk && !headerOk) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
    }

    // Global kill switch
    const ctrl = await prisma.cronControl.findFirst().catch(() => null);
    if (ctrl && !ctrl.cronEnabled) {
      return NextResponse.json({ ok: false, disabled: true });
    }

    // Fetch queued emails
    const emails = await prisma.emailLog.findMany({
      where: {
        status: "queued",
        attempts: { lt: MAX_ATTEMPTS },
      },
      orderBy: { createdAt: "asc" },
      take: BATCH_SIZE,
      include: {
        alert: true,
      },
    });

    if (emails.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        // Re-render body from alert (no HTML stored in DB)
        const alert = email.alert;

        const html = `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
            <h2 style="margin:0 0 12px;">🚨 Price Alert</h2>
            <p><b>Metal:</b> ${alert.metal}</p>
            <p><b>Direction:</b> ${alert.direction}</p>
            <p><b>Target:</b> ${alert.target}</p>
            <p style="opacity:0.7;">Triggered at ${email.createdAt.toISOString()}</p>
          </div>
        `;

        await resend.emails.send({
          from: process.env.ALERT_FROM_EMAIL!,
          to: email.to,
          subject: email.subject,
          html,
        });

        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "sent",
            sentAt: new Date(),
            attempts: { increment: 1 },
            error: null,
          },
        });

        sent++;
      } catch (err: any) {
        failed++;

        await prisma.emailLog.update({
          where: { id: email.id },
          data: {
            status: "failed",
            attempts: { increment: 1 },
            error: err?.message ?? "send failed",
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      processed: emails.length,
      sent,
      failed,
    });
  } catch (err: any) {
    console.error("process-emails failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}