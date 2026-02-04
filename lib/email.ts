import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

export type SendAlertEmailArgs = {
  alertId: string;
  metal: string;
  price: number;
  target: number;
  direction: "above" | "below";
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

  if (!alert?.user?.email) {
    throw new Error("Alert has no user email");
  }

  return resend.emails.send({
    from: process.env.ALERT_FROM_EMAIL!,
    to: alert.user.email,
    subject: `🚨 ${metal.toUpperCase()} Price Alert`,
    html: `
      <h2>🚨 Price Alert Triggered</h2>
      <p><b>Metal:</b> ${metal}</p>
      <p><b>Current Price:</b> $${price.toFixed(2)}</p>
      <p><b>Target:</b> $${target.toFixed(2)}</p>
      <p><b>Direction:</b> ${direction}</p>
      <p><i>${new Date().toLocaleString()}</i></p>
    `,
  });
}