import { Resend } from "resend";

export type QueuedEmail = {
  alertId: string;
  to: string;
  subject: string;
  html?: string;
};

export async function queueEmail({ to, subject, html }: QueuedEmail) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return { ok: false };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  try {
    await resend.emails.send({ from, to, subject, html: html ?? "" });
    return { ok: true };
  } catch (err) {
    console.error("queueEmail failed:", err);
    return { ok: false };
  }
}
