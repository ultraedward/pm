import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type RawEmailArgs = {
  to: string;
  subject: string;
  body: string;
};

export async function sendRawEmail({
  to,
  subject,
  body,
}: RawEmailArgs) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  return resend.emails.send({
    from: "Alerts <alerts@yourdomain.com>",
    to,
    subject,
    html: body,
  });
}