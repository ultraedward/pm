import { prisma } from "@/lib/prisma";

export type QueuedEmail = {
  alertId: string;
  to: string;
  subject: string;
};

export async function queueEmail(email: QueuedEmail) {
  return prisma.emailLog.create({
    data: {
      alertId: email.alertId,
      to: email.to,
      subject: email.subject,
      status: "queued",
      attempts: 0,
    },
  });
}