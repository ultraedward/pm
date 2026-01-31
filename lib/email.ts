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
  // Fetch alert + user email
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

  // 1️⃣ Queue email in DB
  const emailLog = await prisma.emailLog.create({
    data: {
      alertId,
      to: alert.user.email,
      subject,
      status: "queued",
    },
  });

  // 2️⃣ Attempt send immediately
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
  } catch (err: any) {
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "failed",
        lastError: err?.message ?? "send failed",
      },
    });

    throw err;
  }
}