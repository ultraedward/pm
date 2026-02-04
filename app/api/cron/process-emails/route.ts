import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const pendingEmails = await prisma.emailLog.findMany({
    where: { status: "pending" },
    include: {
      alert: true,
    },
    take: 25,
  });

  let sent = 0;

  for (const email of pendingEmails) {
    if (!email.alert) continue;

    const alert = email.alert;

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif">
        <h2>Price Alert Triggered</h2>
        <p><b>Metal:</b> ${alert.metal.toUpperCase()}</p>
        <p><b>Direction:</b> ${alert.direction}</p>
        <p><b>Target Price:</b> $${alert.price.toFixed(2)}</p>
        <p style="opacity:0.7;">
          Triggered at ${email.createdAt.toISOString()}
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email.to,
        subject: `📈 ${alert.metal.toUpperCase()} price alert triggered`,
        html,
      });

      await prisma.emailLog.update({
        where: { id: email.id },
        data: { status: "sent" },
      });

      sent++;
    } catch (err) {
      await prisma.emailLog.update({
        where: { id: email.id },
        data: { status: "failed" },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: pendingEmails.length,
    sent,
  });
}