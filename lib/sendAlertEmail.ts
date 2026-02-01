import { prisma } from "@/lib/prisma";

export type SendAlertEmailArgs = {
  alertId: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendAlertEmail(args: SendAlertEmailArgs) {
  const { alertId, to, subject, html } = args;

  // Queue it (delivery happens in /api/cron/process-emails)
  const log = await prisma.emailLog.create({
    data: {
      alertId,
      to,
      subject,
      status: "queued",
      attempts: 0,
      // If you want to store html in DB, add a column.
      // Keeping schema unchanged; process-emails can re-render html from alert + latest price.
    },
  });

  return log;
}