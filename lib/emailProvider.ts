import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  return resend.emails.send({
    from: "Alerts <alerts@yourdomain.com>",
    to,
    subject,
    html: body,
  });
}