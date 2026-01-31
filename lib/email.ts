import { prisma } from "@/lib/prisma";
import { sendRawEmail } from "@/lib/emailProvider";

type SendAlertEmailArgs = {
  alertId: string;
  metal: string;
  price: number;
  target: number;
  direction: string;
};

export async function sendAlertEmail({
  alertId,
  metal,
  price,
  target,
  direction,
}: SendAlertEmailArgs) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: { user: true },
  });

  if (!alert || !alert.user?.email) {
    throw new Error("Alert or user email not found");
  }

  const subject = `🚨 ${metal.toUpperCase()} alert triggered`;
  const body = `
Your alert for ${metal.toUpperCase()} has triggered.

Direction: ${direction}
Target: ${target}
Current price: ${price}

— Precious Metals Tracker
`.trim();

  // 1️⃣ Create EmailLog (schema-aligned)
  const emailLog = await prisma.emailLog.create({
    data: {
      alertId,
      to: alert.user.email,
      subject,
      status: "queued",
      attempts: 0,
    },
  });

  // 2️⃣ Attempt send
  try {
    await sendRawEmail({
      to: alert.user.email,
      subject,
      body,
    });

    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });
  } catch (err) {
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "failed",
        attempts: { increment: 1 },
      },
    });

    throw err;
  }
}