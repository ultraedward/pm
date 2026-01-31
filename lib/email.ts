import { prisma } from "@/lib/prisma";
import { queueEmail } from "@/lib/emailQueue";

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

  if (!alert?.user?.email) return;

  const subject = `🚨 ${metal.toUpperCase()} alert triggered`;
  const html = `
    <h2>${metal.toUpperCase()} price alert</h2>
    <p>
      Current price: <strong>${price}</strong><br/>
      Target: <strong>${target}</strong><br/>
      Direction: <strong>${direction}</strong>
    </p>
  `;

  await queueEmail({
    to: alert.user.email,
    subject,
    html,
  });

  await prisma.emailLog.create({
    data: {
      alertId,
      email: alert.user.email,
      status: "queued",
    },
  });
}