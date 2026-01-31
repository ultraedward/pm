import { prisma } from "./prisma";

export async function queueEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  await prisma.emailDelivery.create({
    data: {
      to,
      subject,
      body,
      status: "pending",
      nextAttemptAt: new Date(),
    },
  });
}