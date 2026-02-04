import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const pending = await prisma.emailLog.findMany({
    where: {
      status: "pending",
      attempts: { lt: 3 },
    },
    include: {
      alert: true,
    },
  });

  for (const email of pending) {
    try {
      await sendEmail({
        to: email.to,
        subject: "Price Alert Triggered",
        html: `
          <h2>Alert Triggered</h2>
          <p><b>Metal:</b> ${email.alert?.metal}</p>
          <p><b>Direction:</b> ${email.alert?.direction}</p>
          <p><b>Price:</b> ${email.alert?.price}</p>
        `,
      });

      await prisma.emailLog.update({
        where: { id: email.id },
        data: {
          status: "sent",
          attempts: email.attempts + 1,
          // ✅ REMOVED sentAt
        },
      });
    } catch (err) {
      await prisma.emailLog.update({
        where: { id: email.id },
        data: {
          status: "failed",
          attempts: email.attempts + 1,
        },
      });
    }
  }

  return NextResponse.json({ ok: true, processed: pending.length });
}