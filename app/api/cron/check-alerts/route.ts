import { Resend } from "resend";
import { prisma } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

const MAX_ATTEMPTS = 3;

export async function sendAlertEmail(
  alertId: string,
  to: string,
  subject: string,
  html: string
) {
  const log = await prisma.emailLog.create({
    data: {
      alertId,
      to,
      subject,
      status: "pending",
    },
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await resend.emails.send({
        from: "Alerts <alerts@yourdomain.com>",
        to,
        subject,
        html,
      });

      await prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: "sent",
          attempts: attempt,
          sentAt: new Date(),
        },
      });

      return { ok: true };
    } catch (err: any) {
      const delay = attempt * attempt * 1000;
      await new Promise((r) => setTimeout(r, delay));

      await prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: "failed",
          attempts: attempt,
          lastError: err.message ?? "unknown",
        },
      });

      if (attempt === MAX_ATTEMPTS) {
        throw err;
      }
    }
  }
}