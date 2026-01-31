import { prisma } from "@/lib/prisma";

export type QueuedEmail = {
  to: string;
  subject: string;
  html: string;
};

export async function queueEmail(email: QueuedEmail) {
  await prisma.emailQueue.create({
    data: {
      to: email.to,
      subject: email.subject,
      html: email.html,
      status: "queued",
    },
  });
}